import type { CountryCode } from "@/lib/types"

declare module "*/countryCodes.json" {
  const value: CountryCode[]
  export default value
}

