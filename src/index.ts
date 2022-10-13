export class InvalidVCardContent extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class VCard {

  constructor(rawContent: String) {

    if (!VCard.startsWithBegin(rawContent)) {
      throw new InvalidVCardContent(
        "The content entity MUST begin with the BEGIN property " +
        "with a value of \"VCARD\". The value is case-insensitive.")
    }
    if (!VCard.endsWithEnd(rawContent)) {
      throw new InvalidVCardContent(
        "The content entity MUST end with the END type " +
        "with a value of \"VCARD\". The value is case-insensitive.")
    }
    if (!VCard.containsVersion(rawContent)) {
      throw new InvalidVCardContent(
        "A vCard object MUST include the VERSION property.")
    }
    if (VCard.containsVersion4_0(rawContent)) {
      if (!VCard.containsVersion4_0JustAfterBegin(rawContent)) {
        throw new InvalidVCardContent(
          "VERSION:4.0 MUST come immediately after BEGIN:VCARD.")
      }
    }

  }

  private static containsVersion(rawContent: String) {
    return rawContent
      .toLowerCase()
      .split("\n")
      .some(it => it.startsWith("version:"));
  }

  private static startsWithBegin(rawContent: String): boolean {
    return rawContent
      .toLowerCase()
      .startsWith("begin:vcard");

  }

  private static endsWithEnd(rawContent: String): boolean {
    return rawContent
      .toLowerCase()
      .trimEnd()
      .endsWith("end:vcard");
  }

  private static containsVersion4_0JustAfterBegin(rawContent: String) {
    const beginIndex = rawContent.toLowerCase()
      .split('\n')
      .findIndex((value) => value === "begin:vcard")
    const version4_0Index = rawContent.toLowerCase()
      .split('\n')
      .findIndex((value) => value === "version:4.0")

    return version4_0Index === (beginIndex + 1)
  }

  private static containsVersion4_0(rawContent: String) {
    return rawContent
      .toLowerCase()
      .split('\n')
      .includes("version:4.0");
  }
}