import axios from "axios";

export async function useDomainStatus({ domain }: { domain: string }) {
  try {
    const response = await axios.get(`/api/domain/${domain}/verify`);
    console.log(response);
  } catch (err) {
    console.error("there is an error someware");
    console.log(err);
  }
}
