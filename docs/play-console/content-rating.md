# Content rating — draft IARC questionnaire answers

Status: **DRAFT — confirm in Play Console**. The final rating is issued by IARC/Play; do not promise a specific badge in the listing.

## App category and audience

- App type: matchmaking / social connection app for adults.
- Intended audience: **18+**. Do not select child/teen audiences.
- Ads: **none found**.
- In-app purchases: **none found**.
- Gambling, real-money contests, or loot boxes: **none found**.

## Draft answers

| Questionnaire area | Draft answer | Reason / follow-up |
|---|---|---|
| Violence | No | No violent content or game mechanics. |
| Blood, gore, or horror | No | None found. |
| Sexual content or nudity | No in app-provided content | Users can write their own messages/photos; moderation and reporting are not implemented. Review this with the product owner. |
| Profanity | No in app-provided content | User-generated chat is unfiltered. |
| Controlled substances, alcohol, tobacco | No | None found. |
| Gambling or simulated gambling | No | None found. |
| User-generated content | **Yes** | Profiles, photos, chat messages, and Guide prompts are user-generated. |
| Users can interact online | **Yes** | Connection requests and chat. |
| Users can share personal information | **Yes** | Profile fields and chat; sharing controls are partial. |
| Users can share location | No | No location feature found. |
| Users can purchase physical goods | No | None found. |
| Digital purchases | No | None found. |
| Ads | No | No ad SDK found. |
| Unmoderated UGC / report / block | **Not implemented** | No report/block flow found. This is a Play policy and safety risk; owner must decide before submission. |
| External links | No in-app browser links found in the release path | Re-check the signed build. |

## Safety and policy risks

1. **Unmoderated chat and photos.** If the app allows user-generated content, Play expects appropriate moderation, reporting, and blocking. The current client has no report/block flow found.
2. **Dating/matchmaking positioning.** Confirm the listing category and content rating with the product owner; misclassifying a dating-style app creates review risk.
3. **No age gate beyond onboarding DOB.** The backend profile requires age 18–100, but confirm the client blocks under-18 users and the listing is 18+.
4. **Guide content.** If real Gemini is enabled, its safety filters and fallback behavior must be described honestly. Do not claim “moderated” unless it is.

## Declaration to keep consistent

Use the same wording in the listing, privacy policy, and content-rating answers:

> Sambandh Setu is intended for adults 18 and over. Users create profiles and can chat after a connection is accepted. The app does not contain ads or in-app purchases.

## Checklist

- [ ] Complete the IARC questionnaire in Play Console.
- [ ] Confirm UGC moderation/report/block status with the product owner.
- [ ] Confirm 18+ audience and age gate.
- [ ] Confirm no ads/purchases.
- [ ] Record the issued rating and apply it to the listing.
