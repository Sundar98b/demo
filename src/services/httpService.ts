import axios from "axios";
import { notification } from "antd";

const CancelToken = axios.CancelToken;

class HttpService {
  public static getHeader(): any {
    return {
      "x-tenant-id": (window as any).tenant_id,
      "x-token": window.sessionStorage.getItem("x-token"),
    };
  }

  public static get(
    url: any,
    query: any = "",
    params: any = {},
    source: any = undefined,
  ) {
    const xhr = axios({
      method: "GET",
      url: `/api/${url}?${query}`,
      params: params,
      headers: HttpService.getHeader(),
      cancelToken: source?.token || undefined,
    }).then(res => res.data);

    return xhr;
  }
  public static getRequest(
    url: any,
    query: any = "",
    params: any = {},
    cancelable: boolean = false,
  ) {
    const source = CancelToken.source();

    return {
      axios: HttpService.get(url, query, params),
      source: source,
    };
  }
  public static getFile(
    url: any,
    query: any = "",
    params: any = {},
    cancelable: boolean = false,
  ) {
    const source = CancelToken.source();
    const commanHeaders = HttpService.getHeader();
    const xhr = axios({
      method: "GET",
      url: `/api/${url}?${query}`,
      params: params,
      responseType: "blob",
      headers: {
        ...commanHeaders,
        "content-type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      cancelToken: cancelable ? source?.token : undefined,
    }).then(res => res.data);

    return xhr;
  }

  public static post(url: any, obj: object) {
    return axios({
      url: `/api/${url}`,
      method: "post",
      data: obj,
      headers: HttpService.getHeader(),
    }).catch(err => {
      if (
        err?.response?.data?.type === "Validation Error" &&
        err?.response?.data?.message?.details
      ) {
        err.response.data.message.details.forEach((item: any) => {
          notification.error({
            placement: "bottomLeft",
            message: "Validation Error",
            description: item.message,
          });
        });
      }
      return Promise.reject(err);
    });
  }

  public static put(url: any, id: any, obj: object) {
    return axios({
      url: `/api/${url}/${id}`,
      method: "PUT",
      data: obj,
      headers: HttpService.getHeader(),
    }).catch(err => {
      if (
        err?.response?.data?.type === "Validation Error" &&
        err?.response?.data?.message?.details
      ) {
        err.response.data.message.details.forEach((item: any) => {
          notification.error({
            placement: "bottomLeft",
            message: "Validation Error",
            description: item.message,
          });
        });
      }
      return Promise.reject(err);
    });
  }

  public static delete(url: any, id: any) {
    return axios({
      url: `/api/${url}/${id}`,
      method: "DELETE",
      headers: HttpService.getHeader(),
    });
  }
}

export default HttpService;
