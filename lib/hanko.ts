import { tenant } from "@teamhanko/passkeys-next-auth-provider";

const hankoApiKey = process.env.HANKO_API_KEY;
const hankoTenantId = process.env.NEXT_PUBLIC_HANKO_TENANT_ID;

export const isHankoEnabled = Boolean(hankoApiKey && hankoTenantId);

const hanko = isHankoEnabled
  ? tenant({
      apiKey: hankoApiKey!,
      tenantId: hankoTenantId!,
    })
  : null;

export default hanko;
