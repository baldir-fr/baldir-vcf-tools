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

}