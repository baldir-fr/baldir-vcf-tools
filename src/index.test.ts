import {
  assertThrows,
  assertObjectMatch
} from "https://deno.land/std@0.159.0/testing/asserts.ts";
import {InvalidVCardContent, VCard} from "./index.ts";


function parseVCard(rawContent: string): VCard {
  return new VCard(rawContent)
}

Deno.test("VCard", async (t) => {

  await t.step("General Properties", async (generalProperties) => {

    await generalProperties.step("throws when it does not begin with BEGIN:VCARD", () => {

      assertThrows(() => parseVCard(""),
        InvalidVCardContent,
        "The content entity MUST begin with the BEGIN property " +
        "with a value of \"VCARD\". The value is case-insensitive.");
      assertThrows(() => parseVCard("BEGIN:VCAR"),
        InvalidVCardContent,
        "The content entity MUST begin with the BEGIN property " +
        "with a value of \"VCARD\". The value is case-insensitive.");
      assertThrows(() => parseVCard(" BEGIN:VCARD"),
        InvalidVCardContent,
        "The content entity MUST begin with the BEGIN property " +
        "with a value of \"VCARD\". The value is case-insensitive.");

    })

    await generalProperties.step("begins with case-insentitive 'BEGIN:VCARD'", () => {

      assertObjectMatch(parseVCard("BEGIN:VCARD\n" +
        "\n" +
        "END:VCARD\n"), {});
      assertObjectMatch(parseVCard("begin:vcard\n" +
        "\n" +
        "END:VCARD\n"), {});
      assertObjectMatch(parseVCard("BEGIN:VCARd\n" +
        "\n" +
        "END:VCARD\n"), {});
    })

    await generalProperties.step("throws when it does not end with END:VCARD", () => {

      assertThrows(() => parseVCard("BEGIN:VCARD\n" +
          "\n"),
        InvalidVCardContent,
        "The content entity MUST end with the END type " +
        "with a value of \"VCARD\". The value is case-insensitive.");

      assertThrows(() => parseVCard("BEGIN:VCARD\n" +
          "\n" +
          "END:VCAR\n"),
        InvalidVCardContent,
        "The content entity MUST end with the END type " +
        "with a value of \"VCARD\". The value is case-insensitive.");

    })
  });


});