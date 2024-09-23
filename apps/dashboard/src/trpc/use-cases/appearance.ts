import { updateAccountLang } from "../data-access/account";

export async function setAccountLanguageUseCase({
  accountId,
  currentLang,
}: {
  accountId: string;
  currentLang: "en" | "ar";
}) {
  try {
    const response = await updateAccountLang({
      id: accountId,
      lang: currentLang,
    });
  } catch (err) {
    console.log(err);
  }
}
