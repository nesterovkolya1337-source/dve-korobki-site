# Figma handoff

- **File key:** `I3VjCQVEO11bDEw2Gf4HOd`
- **File:** https://www.figma.com/design/I3VjCQVEO11bDEw2Gf4HOd/Untitled
- **Rule:** implement only the frames in this table. Hidden and archived frames are references, not production sources.

| Route | Figma page | Desktop | Mobile | Priority |
|---|---|---|---|---|
| `/` | 01_HOME_DESKTOP | `HOME_DESKTOP_V2` / `40:2` | `HOME_MOBILE_V2_QA_FIXED_2026_07_05` / `155:2` | P0 |
| `/diagnostika-dsg-powershift-dct/` | 42_DIAGNOSTICS | `DIAGNOSTICS_DESKTOP_FINAL` / `115:2` | `DIAGNOSTICS_MOBILE_V1_2026_07_05` / `150:963` | P0 |
| `/remont-mehatronika-dsg-dct/` | 40_MECHATRONIC | `MECHATRONIC_DESKTOP_FINAL` / `105:2` | `MECHATRONIC_MOBILE_V1_2026_07_05` / `150:803` | P0 |
| `/remont-dsg-dq200/` | 10_DQ200 | `DQ200_DESKTOP_FINAL` / `57:2` | `DQ200_MOBILE_FINAL_QA_FIXED_2026_07_05` / `155:197` | P0 |
| `/remont-dsg-dq250/` | 11_DQ250 | `DQ250_DESKTOP_SAFE_V2` / `63:2` | `DQ250_MOBILE_V1_2026_07_05` / `150:3` | P0 |
| `/remont-powershift-dps6/` | 14_DPS6 | `DPS6_DESKTOP_FINAL` / `65:3` | `DPS6_MOBILE_V1_2026_07_05` / `150:243` | P0 |
| `/kontakty/` | 91_CONTACTS | `CONTACTS_DESKTOP_FINAL` / `117:2` | `CONTACTS_MOBILE_V1_2026_07_05` / `152:408` | P0 |
| `/remont-powershift-mps6/` | 15_MPS6 | `MPS6_DESKTOP_FINAL` / `65:242` | `MPS6_MOBILE_V1_2026_07_05` / `150:323` | P1 |
| `/remont-s-tronic-dl501/` | 13_DL501 | `DL501_DESKTOP_SAFE_V2` / `63:478` | `DL501_MOBILE_V1_2026_07_05` / `150:163` | P1 |
| `/remont-dsg-dq500/` | 12_DQ500 | `DQ500_DESKTOP_SAFE_V2` / `63:240` | `DQ500_MOBILE_V1_2026_07_05` / `150:83` | P1 |
| `/zamena-stsepleniya-dsg-dct/` | 44_CLUTCH_DSG_DESKTOP | `CLUTCH_DSG_DESKTOP_FINAL_2026_07_05` / `162:3` | `CLUTCH_DSG_MOBILE_V1_2026_07_05` / `152:165` | P1 |
| `/adaptaciya-dsg-powershift-dct/` | 43_ADAPTATION_DESKTOP | `ADAPTATION_DESKTOP_FINAL_2026_07_05` / `162:77` | `ADAPTATION_MOBILE_V1_2026_07_05` / `152:84` | P1 |
| `/remont-dvuhmassovyh-mahovikov/` | 41_FLYWHEELS | `FLYWHEELS_DESKTOP_FINAL` / `111:2` | `FLYWHEELS_MOBILE_V1_2026_07_05` / `150:883` | P1 |
| `/remont-geely-7dct/` | 16_Geely_7DCT | `GEELY_7DCT_DESKTOP_FINAL` / `68:3` | `GEELY_7DCT_MOBILE_V1_2026_07_05` / `150:403` | P2 |
| `/remont-chery-getrag-7dct300/` | 17_Chery_Getrag_7DCT300 | `CHERY_GETRAG_7DCT300_DESKTOP_FINAL` / `68:242` | `CHERY_7DCT300_MOBILE_V1_2026_07_05` / `150:483` | P2 |
| `/remont-exeed-borgwarner-7dct/` | 18_Exeed_BorgWarner_7DCT | `EXEED_BORGWARNER_7DCT_DESKTOP_FINAL` / `68:481` | `EXEED_7DCT_MOBILE_V1_2026_07_05` / `150:563` | P2 |
| `/remont-magna-pt-7dct/` | 19_Magna_PT_7DCT | `MAGNA_PT_7DCT_DESKTOP_FINAL` / `68:720` | `MAGNA_7DCT_MOBILE_V1_2026_07_05` / `150:643` | P2 |
| `/remont-omoda-jaecoo-dct/` | 20_Omoda_Jaecoo | `OMODA_JAECOO_DCT_DESKTOP_FINAL` / `68:959` | `OMODA_JAECOO_MOBILE_V1_2026_07_05` / `150:723` | P2 |
| `/remont-hyundai-kia-d7uf1-d7gf1/` | 21_Hyundai_Kia_D7UF1_D7GF1 | `HYUNDAI_KIA_DCT_DESKTOP_FINAL` / `68:1198` | `HYUNDAI_KIA_D7UF1_MOBILE_V1_2026_07_05` / `152:3` | P2 |
| `/uslugi/` | 48_SERVICES_INDEX_DESKTOP | `SERVICES_INDEX_DESKTOP_FINAL_2026_07_05` / `162:225` | `SERVICES_INDEX_MOBILE_V1_2026_07_05` / `152:489` | P2 |
| `/ceny/` | 45_PRICES_DESKTOP | `PRICES_DESKTOP_FINAL_2026_07_05` / `162:151` | `PRICES_MOBILE_V1_2026_07_05` / `152:246` | P2 |
| `/o-nas/` | 90_ABOUT | `ABOUT_DESKTOP_FINAL` / `116:2` | `ABOUT_MOBILE_V1_2026_07_05` / `152:327` | P2 |

## Implementation rule

1. Figma is the visual source of truth.
2. `content/*.json` is the business/content source of truth.
3. Never copy phone, prices, addresses or warranty text directly into templates.
4. Old frames must be ignored when their name includes `ARCHIVE`, `DO_NOT_BUILD`, `V1`, or `SUPERSEDED`, unless the table explicitly selects them.
5. Images for a named gearbox require a technically confirmed source. Generic AI imagery may only be used for general service sections.
