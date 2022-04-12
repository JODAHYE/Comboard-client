import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export function useAlert() {
  const getAlertList = async (skip: number) => {
    const response = await axios.get(`/alert/list`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
      params: {
        skip: skip,
      },
    });
    const data = await response.data.list;
    return data;
  };
  const alertRead = async (alertId: string) => {
    await axios.patch(
      `/alert/read`,
      { alertId },
      {
        headers: {
          Authorization: cookies.get("accessToken"),
        },
      }
    );
  };
  const alertDelete = async () => {
    await axios.delete(`/alert/delete`, {
      headers: {
        Authorization: cookies.get("accessToken"),
      },
    });
  };
  return {
    getAlertList,
    alertRead,
    alertDelete,
  };
}
