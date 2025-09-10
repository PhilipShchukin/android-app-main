import { useDispatch } from "react-redux";

import { ITemplateResponce, LabelType } from "../API/types/types";
import { apiClient, handleError, handleResponse } from "../API/apiClient";
import { addBoxTemplate, addPalletTemplate } from "../store/templateSlice";
import {
  getBoxTemplate,
  getPalletTemplate,
} from "../components/Labels.ts/helper";

const useTemplateDispatch = () => {
  const dispatch = useDispatch();

  const getAllTemplates = async (): Promise<
    | {
        boxTemplate: ITemplateResponce | undefined;
        palletTemplate: ITemplateResponce | undefined;
      }
    | undefined
  > => {
    try {
      const response = await apiClient.get<any[]>(`/template`);
      console.log("getAllTemplates", response);

      const data = handleResponse(response) as ITemplateResponce[];
      if (data && data.length) {
        const boxTemplate = getBoxTemplate(data);
        const palletTemplate = getPalletTemplate(data);
        if (boxTemplate) {
          dispatch(addBoxTemplate(boxTemplate.template));
        }
        if (palletTemplate) {
          dispatch(addPalletTemplate(palletTemplate.template));
        }
        return { boxTemplate, palletTemplate };
      }
    } catch (err) {
      handleError(err, "Ошибка при получении списка файлов задания");
      return undefined;
    }
  };

  const saveTemplate = async (
    template: string[],
    type: LabelType
  ): Promise<any | undefined> => {
    try {
      const response = await apiClient.post<string>("/template/save", {
        template,
        type,
      });
      console.log("saveTemplate", response);

      // return handleResponse(response);
    } catch (err) {
      handleError(err, "Ошибка при сохранении шаблона");
      return undefined;
    }
  };

  return { getAllTemplates, saveTemplate };
};

export default useTemplateDispatch;
