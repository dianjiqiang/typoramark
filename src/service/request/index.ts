import useSystemStore from "@/store/modules/system";
import axios from "axios";
import type { AxiosInstance } from "axios";
import type { KeyieRequestConfig } from "./../type/index";
import { UNAUTH_ERROR_CODE } from "@/constants/constants";
import { ElMessage } from "element-plus";
import router from "@/router";

class KeyieRequest {
  instance: AxiosInstance;

  // request实例 => axios的实例
  constructor(config: KeyieRequestConfig) {
    this.instance = axios.create(config);

    // 全局请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log("请求成功的拦截");
        const token = localStorage.getItem("token");
        if (!config?.headers) {
          config.headers = {};
        }
        config.headers.authorization = token;
        return config;
      },
      (err) => {
        console.log("请求失败的拦截");
        return err;
      }
    );
    // 全局结果拦截器
    this.instance.interceptors.response.use(
      (res) => {
        const { code, msg } = res.data;
        if (code !== 0 && msg) {
          ElMessage.error(msg);
          if (code === UNAUTH_ERROR_CODE) {
            localStorage.removeItem("token");
            router.replace("/login");
          }
        } else {
          msg && ElMessage.success(msg);
        }
        return res.data;
      },
      (err) => {
        console.log("响应失败的拦截");
        return err;
      }
    );

    //添加局部拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.onFulfilled,
      config.interceptors?.onRejected
    );
    this.instance.interceptors.response.use(
      config.interceptors?.onFulfilledRes,
      config.interceptors?.onRejectedRes
    );
  }

  // 封装网络请求的方法
  request<T = any>(config: KeyieRequestConfig<T>, flag?: string) {
    // 自己在这里进行深层定制 单次请求拦截
    if (config.interceptors?.onFulfilled) {
      config = config.interceptors.onFulfilled(config);
    }

    return new Promise<T>((resolve, reject) => {
      this.instance
        // 我们这里 request本身都是具有两个泛型的 我们应该是要改变第二个泛型
        .request<any, T>(config)
        .then((res: any) => {
          if (config.interceptors?.onFulfilledRes) {
            res = config.interceptors.onFulfilledRes(res);
          }
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }
  get<T = any>(config: KeyieRequestConfig<T>) {
    return this.request({ ...config, method: "GET" });
  }
  post<T = any>(config: KeyieRequestConfig<T>) {
    return this.request({ ...config, method: "POST" });
  }
  delete<T = any>(config: KeyieRequestConfig<T>) {
    return this.request({ ...config, method: "DELETE" });
  }
  patch<T = any>(config: KeyieRequestConfig<T>) {
    return this.request({ ...config, method: "PATCH" });
  }
  file<T = any>(config: KeyieRequestConfig<T>) {
    return this.request({
      ...config,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;charset=UTF-8",
      },
    });
  }
  put<T = any>(config: KeyieRequestConfig<T>) {
    return this.request({ ...config, method: "PUT" });
  }
}

export default KeyieRequest;
