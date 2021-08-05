import { History } from "history";
import { useState, useEffect, useRef } from "react";
import { getCurrentLanguage } from "x4b-ui";
import App from "./App";
import { config, ProductVersion } from "./settings";

const AppWithBanner = ({ history }: { history: History }) => {
  const x4buiRef = useRef<HTMLX4bUiElement>();
  // const [isFullSizeMenu, setIsFullSizeMenu] = useState(true);
  const [isBannerInitialized, setIsBannerInitialized] = useState(false);
  const [lang, setLang] = useState(getCurrentLanguage());

  useEffect(() => {
    // const handleMenuButtonToggled = (e: CustomEvent<boolean>) => setIsFullSizeMenu(e.detail);
    const handleLanguageSelected = (e: Event) =>
      setLang((e as CustomEvent).detail);
    const handleStartupFinished = () => {
      handleTokenRefreshed();
      setIsBannerInitialized((isBannerInitialized) => !isBannerInitialized);
    };
    const handleTokenRefreshed = () => {};
    const currentX4B = x4buiRef?.current;
    x4buiRef?.current?.addEventListener(
      "languageSelected",
      handleLanguageSelected
    );
    // x4buiRef?.current?.addEventListener('menuToggleButtonClicked', handleMenuButtonToggled);
    currentX4B?.addEventListener("startupFinished", handleStartupFinished);
    currentX4B?.addEventListener("tokenRefreshed", handleTokenRefreshed);
    return () => {
      x4buiRef?.current?.removeEventListener(
        "languageSelected",
        handleLanguageSelected
      );
      // x4buiRef?.current?.removeEventListener('menuToggleButtonClicked', handleMenuButtonToggled);
      currentX4B?.removeEventListener("startupFinished", handleStartupFinished);
      currentX4B?.removeEventListener("tokenRefreshed", handleTokenRefreshed);
    };
  }, [x4buiRef, history]);

  return (
    <x4b-ui
      application="servicefull-spy"
      apps-service-url={config?.x4b?.appsUrl}
      disable-fake-elements={true}
      version={ProductVersion}
      languages="en fr"
      ref={x4buiRef}
      color={"#9E3218"}
      notification-count={0}
    >
      {isBannerInitialized && <App lang={lang} />}
    </x4b-ui>
  );
};

export default AppWithBanner;
