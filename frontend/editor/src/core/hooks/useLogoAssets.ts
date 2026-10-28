import { useMemo } from "react";
import { BASE_PATH } from "@app/constants/app";

const LOGO_FOLDER = "modern-logo";

export function useLogoAssets() {
  return useMemo(() => {
    const folderPath = `${BASE_PATH}/${LOGO_FOLDER}`;

    return {
      folderPath,
      getAssetPath: (name: string) => `${folderPath}/${name}`,
      wordmark: {
        black: `${folderPath}/CerradoPDFText.png`,
        grey: `${folderPath}/CerradoPDFText.png`,
        white: `${folderPath}/CerradoPDFText.png`,
      },
      tooltipLogo: `${folderPath}/CerradoPDFMark.png`,
      firstPage: `${folderPath}/Firstpage.png`,
      favicon: `${folderPath}/favicon.ico`,
      logo192: `${folderPath}/logo192.png`,
      logo512: `${folderPath}/logo512.png`,
      manifestHref: `${BASE_PATH}/manifest.json`,
    };
  }, []);
}
