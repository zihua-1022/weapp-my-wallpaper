import { mergeUploadFile } from "@/api/profile";
import sparkMD5 from "spark-md5";
import Taro from "@tarojs/taro";

export type TFileData = {
  path: string; // 文件路径带后缀名
  uploadUrl: string; // 上传接口
  enableOss?: boolean; // 默认不开启
  chunkSize?: number; // 每个切片的大小单位byte 1024byte = 1KB
  // byteLength: number; // 文件大小
  dirFlag?: string;
  imgCategory?: string | number;
  callback: Function;
};

export type TChunkData = {
  file: ArrayBuffer;
  filename: string;
};

export default class BigFileUpload {
  fileData: TFileData;
  fileSize: number; // 文件大小
  suffix: string; // 文件后缀
  chunkSize: number; // 每个切片的大小 默认1M = (1024 * 1024)byte
  totalChunks: number; // 最大允许分割的切片数量为15
  chunkIndex: number; // 当前切片标识
  FILE_HASH: string; // 上传文件的hash值
  chunkList: TChunkData[];
  alreadyChunkList: string[];
  constructor(data: TFileData) {
    this.FILE_HASH = "";
    this.chunkIndex = 0;
    this.chunkList = [];
    this.fileData = data;
    this.alreadyChunkList = [];
  }

  async startUpload() {
    const fileBuffer = await this.fileSlice();
    const suffixList = this.fileData.path.split(".");
    this.suffix = suffixList[suffixList.length - 1]; // 文件后缀
    this.fileSize = fileBuffer.byteLength;

    this.chunkSize = this.fileData.enableOss
      ? this.fileSize
      : this.fileData.chunkSize || 1024 * 1024;
    this.totalChunks = Math.ceil(this.fileSize / this.chunkSize);
    this.FILE_HASH = this.getDataMD5(fileBuffer);
    if (this.fileSize <= this.chunkSize || this.fileData.enableOss) {
      this.uploadFileBinary(fileBuffer, 0)
        .then((uploadRes) => {
          // this.alreadyChunkList.push(uploadRes);
          if (this.fileData.enableOss) {
            this.fileData.callback(uploadRes);
          } else {
            this.chunkIndex++;
            this.complate();
          }
        })
        .catch((err) => {
          this.fileData.callback({
            status: false,
            msg: err,
            // data: null,
          });
        });
    } else {
      // 判断当前文件可以切出多少切片
      if (this.totalChunks > 15) {
        // 如果切片数量大于最大值
        this.chunkSize = this.fileSize / 15; // 则改变切片大小
        this.totalChunks = 15;
      }
      this.loadNext();
    }
  }

  async loadNext() {
    let start = this.chunkIndex * this.chunkSize;
    let length =
      start + this.chunkSize >= this.fileSize
        ? this.fileSize - start
        : this.chunkSize;
    const res = await this.fileSlice(start, length);
    this.uploadFileBinary(res, this.chunkIndex)
      .then((uploadRes) => {
        this.chunkIndex++;
        this.complate();
      })
      .catch((err) => {
        this.fileData.callback({
          status: false,
          msg: err,
          // data: null,
        });
      });
  }

  fileSlice(start?: number, length?: number): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      Taro.getFileSystemManager().readFile({
        filePath: this.fileData.path,
        // encoding: "binary",
        position: start,
        length: length,
        success: (res) => {
          const arrayBuffer = res.data as ArrayBuffer;
          resolve(arrayBuffer);
        },
        fail: (err) => {
          // console.error("fileSlice", err);
          reject(err);
        },
      });
    });
  }

  uploadFileBinary(
    data: ArrayBuffer,
    chunkIndex: number
  ): Promise<{
    code: number;
    data: {
      hash: string;
      dHash: string;
      path: string;
      dPath: string;
      imgSize: number;
      dSize: number;
    };
    msg: string;
    status: boolean;
  }> {
    return new Promise((resolve, reject) => {
      const fs = Taro.getFileSystemManager();
      const tempFileDir = `${Taro.env.USER_DATA_PATH}/up_temp`;
      const tempPath = `${tempFileDir}/${this.FILE_HASH}_${chunkIndex}.${this.suffix}`;
      fs.access({
        path: `${tempFileDir}`,
        fail() {
          fs.mkdirSync(`${tempFileDir}`, false);
        },
      });
      fs.writeFile({
        filePath: tempPath,
        encoding: "binary",
        data: data,
        success: () => {
          Taro.uploadFile({
            url: this.fileData.uploadUrl,
            filePath: tempPath,
            name: "file",
            formData: {
              suffix: this.suffix,
              imageType: this.fileData.dirFlag,
              cid: this.fileData.imgCategory,
            },
            success: (res) => {
              if (res.statusCode === 200) {
                const uploadResult = JSON.parse(res.data);
                resolve(uploadResult);
                // this.chunkIndex++;
                // this.complate();
              } else {
                // console.log("uploadFile ", res);
                reject("上传文件切片失败");
              }
            },
            fail: (err) => {
              // console.error(" file upload", err);
              reject(err);
            },
          });
        },
        fail: (err) => {
          // console.error("write file failed", err);
          reject(err);
        },
      });
    });
  }

  getDataMD5(data: ArrayBuffer) {
    const spark = new sparkMD5.ArrayBuffer();
    spark.append(data);
    const HASH = spark.end();
    return HASH;
  }

  complate() {
    const progress = `(${this.chunkIndex}/${this.totalChunks})%`; // 进度条
    if (this.chunkIndex >= this.totalChunks) {
      mergeUploadFile({
        hash: this.FILE_HASH,
        totalCount: this.totalChunks,
        imageType: this.fileData.dirFlag,
      })
        .then((res) => {
          this.fileData.callback({
            status: true,
            msg: res.msg,
            data: res.data,
          });
        })
        .catch((err) => {
          this.fileData.callback({
            status: false,
            msg: err,
            // data: null,
          });
        });
    } else {
      this.loadNext();
    }
  }
}
