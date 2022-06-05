import ALertAPI from "../lib/api/AlertAPI";

export function useAlert() {
  const getAlertList = async (skip: number) => {
    const data = await ALertAPI.getAlertList(skip);
    return data;
  };

  const alertRead = async (alertId: string) => {
    const data = await ALertAPI.readAlert(alertId);
    return data;
  };

  const alertDelete = async () => {
    const data = await ALertAPI.deleteAlert();
    return data;
  };

  return {
    getAlertList,
    alertRead,
    alertDelete,
  };
}
