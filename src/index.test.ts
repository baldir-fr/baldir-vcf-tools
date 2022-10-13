import {
  assertThrows,
  assertObjectMatch,
  fail
} from "https://deno.land/std@0.159.0/testing/asserts.ts";
import {InvalidVCardContent, VCard} from "./index.ts";

function parseVCard(rawContent: string): VCard {
  return new VCard(rawContent)
}

Deno.test("VCard", async (t) => {

  await t.step("General Properties", async (generalProperties) => {

    await generalProperties.step(
      "constructs with the minimal required properties", () => {

        assertObjectMatch(parseVCard("BEGIN:VCARD\n" +
          "VERSION:4.0\n" +
          "FN: Marc Bouvier\n" +
          "END:VCARD\n"), {});
        assertObjectMatch(parseVCard("begin:vcard\n" +
          "VERSION:4.0\n" +
          "FN: Marc Bouvier\n" +
          "END:VCARD\n"), {});
        assertObjectMatch(parseVCard("BEGIN:VCARd\n" +
          "VERSION:4.0\n" +
          "FN: Marc Bouvier\n" +
          "END:VCARD\n"), {});
      })

    // https://datatracker.ietf.org/doc/html/rfc6350#section-6.1.1
    await generalProperties.step(
      "throws when it does not begin with BEGIN:VCARD", () => {

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

    // https://datatracker.ietf.org/doc/html/rfc6350#section-6.1.2
    await generalProperties.step(
      "throws when it does not end with END:VCARD", () => {

        assertThrows(() => parseVCard("BEGIN:VCARD\n" +
            "\n"),
          InvalidVCardContent,
          "The content entity MUST end with the END type " +
          "with a value of \"VCARD\". The value is case-insensitive.");

        assertThrows(() => parseVCard("BEGIN:VCARD\n" +
            "VERSION:4.0\n" +
            "END:VCAR\n"),
          InvalidVCardContent,
          "The content entity MUST end with the END type " +
          "with a value of \"VCARD\". The value is case-insensitive.");

      })

    // https://datatracker.ietf.org/doc/html/rfc6350#section-3.3
    await generalProperties.step(
      "throws when VERSION is not present", () => {

        assertThrows(() => parseVCard("BEGIN:VCARD\n" +
            "\n" +
            "END:VCARD\n"),
          InvalidVCardContent,
          "A vCard object MUST include the VERSION property.");

      })

    // https://datatracker.ietf.org/doc/html/rfc6350#section-3.3
    await generalProperties.step(
      "throws when VERSION:4.0 does not come immediately after BEGIN:VCARD", () => {

        assertThrows(() => parseVCard("BEGIN:VCARD\n" +
            "SOMETHINNG\n" +
            "VERSION:4.0\n" +
            "END:VCARD\n"),
          InvalidVCardContent,
          "VERSION:4.0 MUST come immediately after BEGIN:VCARD.");

      })

    // https://datatracker.ietf.org/doc/html/rfc6350#section-6.7.9
    // https://en.wikipedia.org/wiki/VCard
    const supportedVersions = [["2.1"], ["3.0"], ["4.0"]];
    for (const [version] of supportedVersions) {
      await generalProperties.step(
        `constructs when VERSION is ${version}`, () => {
          try {
            parseVCard("BEGIN:VCARD\n" +
              `VERSION:${version}\n` +
              "FN: Marc Bouvier\n" +
              "END:VCARD\n")
          } catch (e) {
            fail("should not throw")
          }
        })
    }

    const unsupportedVersions = [["2."], [""], ["1.0"]];
    for (const [version] of unsupportedVersions) {
      await generalProperties.step(
        `throws when VERSION is not supported ("${version}")`, () => {
          assertThrows(() => parseVCard("BEGIN:VCARD\n" +
              `VERSION:${version}\n` +
              "FN: Marc Bouvier\n" +
              "END:VCARD\n"), InvalidVCardContent,
            "A vCard object MUST include a valid VERSION property.")
        })
    }


    // https://datatracker.ietf.org/doc/html/rfc6350#section-3.3
    // https://datatracker.ietf.org/doc/html/rfc6350#section-6.2.1
    await generalProperties.step(
      "throws when FN property is not present", () => {

        assertThrows(() => parseVCard("BEGIN:VCARD\n" +
            "VERSION:4.0\n" +
            "\n" +
            "END:VCARD\n"),
          InvalidVCardContent,
          "A vCard object MUST include the FN property.");

      })

  });


});