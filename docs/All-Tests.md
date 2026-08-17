# All Implemented Tests

> Auto-generated from source by `tools/ExtractAllTests.java` + `tools/GenerateAllTestsMd.java`.
> Java/JUnit 5 (`frameworks/java-selenium`) + TypeScript/Playwright (`frameworks/ts-playwright`).
> Do not edit by hand - regenerate with `java tools/ExtractAllTests.java && java tools/GenerateAllTestsMd.java`.

**Total:** 408 tests - 298 Java/Selenium + 110 TS/Playwright.

## Summary by sprint

| Sprint | Tests |
|---|---:|
| Sprint 1 - Core user system and property browsing | 139 |
| Sprint 2 - Host functionality | 110 |
| Sprint 3 - Finding and saving properties | 60 |
| Sprint 4 - Making and managing reservations | 54 |
| Sprint 4, 5 - Notifications (cross-sprint: booking + social) | 6 |
| Sprint 5 - Social features: reviews, messaging, notifications | 39 |

## Summary by layer

| Layer | Tests |
|---|---:|
| API | 106 |
| UI | 240 |
| E2E | 62 |

## Summary by framework

| Framework | Tests |
|---|---:|
| Java/Selenium | 298 |
| TS/Playwright | 110 |

---

## Sprint 1 - Core user system and property browsing (139)

### F1.4a - View Own Profile

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| AuthMeApiTest | testAuthMeApiLoggedInContainsExpectedField |  | API | api | Parameterized | Java/Selenium |
| AuthMeApiTest | testAuthMeApiLoggedInResponseNotNull | Auth/me API response is not null when logged in | API | api | Test | Java/Selenium |
| AuthMeApiTest | testAuthMeApiLoggedOut | Auth/me API returns 401 when not logged in | API | api | Test | Java/Selenium |
| OwnProfileTest | testOwnProfileAvatarDisplayed | Own profile displays correct avatar | UI | regression | Test | Java/Selenium |
| OwnProfileTest | testOwnProfileBioNotEmpty | Own profile bio is not empty | UI | regression | Test | Java/Selenium |
| OwnProfileTest | testOwnProfileEditProfileButtonNavigation | Clicking Edit Profile button navigates to edit profile page | UI | regression | Test | Java/Selenium |
| OwnProfileTest | testOwnProfileEditProfileButtonVisible | Own profile shows Edit Profile button | UI | regression | Test | Java/Selenium |
| OwnProfileTest | testOwnProfileFirstName | Own profile shows correct first name | UI | regression | Test | Java/Selenium |
| OwnProfileTest | testOwnProfileLastName | Own profile shows correct last name | UI | regression | Test | Java/Selenium |
| OwnProfileTest | testOwnProfileMetaContainsMemberSince | Own profile meta contains 'Member since' | UI | regression | Test | Java/Selenium |
| OwnProfileTest | testOwnProfilePhone | Own profile shows correct phone number | UI | regression | Test | Java/Selenium |

### F1.2 - User Login

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| LoginApiTest | testLoginApiResponseContainsExpectedField |  | API | api | Parameterized | Java/Selenium |
| LoginApiTest | testLoginApiReturns200ForValidCredentials | Login API returns 200 for valid credentials | API | api | Test | Java/Selenium |
| LoginApiTest | testLoginApiReturns400ForMissingFields | Login API returns 400 when required fields are missing | API | api | Test | Java/Selenium |
| LoginApiTest | testLoginApiReturns401ForInvalidCredentials | Login API returns 401 for invalid credentials | API | api | Test | Java/Selenium |
| LoginTest | testLoginPageHasRegisterLink | Login page has a 'Register' link that navigates to the register page | UI | smoke | Test | Java/Selenium |
| LoginTest | testLoginWithBlankFields | Login with blank fields shows inline validation error | UI | smoke | Test | Java/Selenium |
| LoginTest | testLoginWithInvalidCredentials | Login with invalid credentials shows error message | UI | smoke | Test | Java/Selenium |
| LoginTest | testSuccessfulLoginRedirection | Successful login redirects to home page | UI | smoke | Test | Java/Selenium |

### F1.3 - User Logout

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| LogoutApiTest | testAuthEndpointReturns401AfterLogout | Accessing an authenticated endpoint without a token after logout returns 401 | API | api | Test | Java/Selenium |
| LogoutApiTest | testLogoutApiReturns200WhenLoggedIn | Logout API returns 200 when authenticated | API | api | Test | Java/Selenium |
| LogoutApiTest | testLogoutApiReturns401WhenNotLoggedIn | Logout API returns 401 when not authenticated | API | api | Test | Java/Selenium |
| LogoutTest | testLogoutRedirectionToHomepage | Logout redirects to homepage | UI | smoke | Test | Java/Selenium |
| LogoutTest | testTokenPresentAfterLogin | JWT token is present in localStorage after login | UI | smoke | Test | Java/Selenium |
| LogoutTest | testTokenRemovedAfterLogout | JWT token is removed from localStorage after logout | UI | smoke | Test | Java/Selenium |

### F1.1 - User Registration

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| RegisterApiTest | testRegisterApiResponseContainsExpectedField |  | API | api | Parameterized | Java/Selenium |
| RegisterApiTest | testRegisterApiReturns201ForValidPayload | Register API returns 201 for a valid payload | API | api | Test | Java/Selenium |
| RegisterApiTest | testRegisterApiReturns400ForMissingFields | Register API returns 400 when required fields are missing | API | api | Test | Java/Selenium |
| RegisterApiTest | testRegisterApiReturns409ForExistingEmail | Register API returns 409 when email already exists | API | api | Test | Java/Selenium |
| RegisterTest | testRegisterPageHasLoginLink | Register page has a 'Log in' link that navigates to the login page | UI | smoke | Test | Java/Selenium |
| RegisterTest | testRegistrationValidation |  | UI | smoke | Parameterized | Java/Selenium |
| RegisterTest | testSuccessfulRegistration | Successful registration redirects to home page | UI | smoke | Test | Java/Selenium |

### F1.4b - View Another User's Public Profile

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| OtherProfileTest | testNonExistentUserProfile | Non-existent user profile shows 404 | UI | regression | Test | Java/Selenium |
| OtherProfileTest | testOtherUserProfileAvatarSrc | Other user's profile displays the correct avatar | UI | regression | Test | Java/Selenium |
| OtherProfileTest | testOtherUserProfileBio | Other user's bio is displayed correctly | UI | regression | Test | Java/Selenium |
| OtherProfileTest | testOtherUserProfileEmailNotVisible | Other user's email is not visible on their profile | UI | regression | Test | Java/Selenium |
| OtherProfileTest | testOtherUserProfileMetaContainsMemberSince | Other user's profile meta contains 'Member since' | UI | regression | Test | Java/Selenium |
| OtherProfileTest | testOtherUserProfileMetaContainsRole | Other user's profile meta contains their role | UI | regression | Test | Java/Selenium |
| OtherProfileTest | testOtherUserProfileName | Other user's profile shows correct name | UI | regression | Test | Java/Selenium |
| OtherProfileTest | testOtherUserProfilePhoneNotVisible | Other user's phone number is not visible on their profile | UI | regression | Test | Java/Selenium |
| OtherUserApiTest | testApiViewOtherUserContainsField |  | API | api | Parameterized | Java/Selenium |
| OtherUserApiTest | testApiViewOtherUserDoesNotContainField |  | API | api | Parameterized | Java/Selenium |
| OtherUserApiTest | testApiViewOtherUserResponseNotNull | View other user API response is not null | API | api | Test | Java/Selenium |

### F1.5 - Edit User Profile

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| EditProfileTest | testEditProfileCancel | Cancelling edit profile does not save changes | UI | regression | Test | Java/Selenium |
| EditProfileTest | testEditProfilePersistsBio | Edit profile persists updated bio | UI | regression | Test | Java/Selenium |
| EditProfileTest | testEditProfilePersistsFullName | Edit profile persists updated full name | UI | regression | Test | Java/Selenium |
| EditProfileTest | testEditProfilePersistsPhone | Edit profile persists updated phone | UI | regression | Test | Java/Selenium |
| EditProfileTest | testEditProfileUnauthorizedAccess | Accessing edit profile while logged out shows 401 error | UI | regression | Test | Java/Selenium |
| EditProfileTest | testEditProfileValidationErrorMessageFirstName | Validation message shown when first name is empty | UI | regression | Test | Java/Selenium |
| EditProfileTest | testEditProfileValidationErrorMessageLastName | Validation message shown when last name is empty | UI | regression | Test | Java/Selenium |
| UpdateProfileApiTest | testApiUpdateUserProfileResponseContainsUpdatedFirstName | Update profile API response contains the updated first name | API | api | Test | Java/Selenium |
| UpdateProfileApiTest | testApiUpdateUserProfileResponseNotNull | Update profile API response is not null | API | api | Test | Java/Selenium |
| UpdateProfileApiTest | testApiUpdateUserProfileTokenNotNull | Auth token is present in localStorage when logged in | API | api | Test | Java/Selenium |

### F1.7 - Property Listing Page

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| PropertyListingTest | testFirstPropertyCardHasImage | First property card has an image | UI | regression | Test | Java/Selenium |
| PropertyListingTest | testFirstPropertyCardHasTitle | First property card has a title | UI | regression | Test | Java/Selenium |
| PropertyListingTest | testFirstPropertyCardLocationFormat | First property card location is in 'City, Country' format | UI | regression | Test | Java/Selenium |
| PropertyListingTest | testFirstPropertyCardPriceFormat | First property card price contains '/ night' | UI | regression | Test | Java/Selenium |
| PropertyListingTest | testGridColumnsOnDesktopLarge | Property grid shows 4 columns on large desktop | UI | regression | Test | Java/Selenium |
| PropertyListingTest | testGridColumnsOnDesktopMedium | Property grid shows 3 columns on medium desktop | UI | regression | Test | Java/Selenium |
| PropertyListingTest | testGridColumnsOnTablet | Property grid shows 2 columns on tablet viewport | UI | regression | Test | Java/Selenium |
| PropertyListingTest | testPropertyCardNavigation | Clicking a property card navigates to the property detail page | UI | regression | Test | Java/Selenium |
| PropertyListingTest | testPropertyListingHasCards | Property listing page displays property cards | UI | regression | Test | Java/Selenium |

### F1.6 - Home Page

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| HomeTest | testCategoryBarContainsIcons | Category bar contains at least one category icon | UI | regression | Test | Java/Selenium |
| HomeTest | testCategoryBarIsDisplayed | Category bar is displayed on home page | UI | regression | Test | Java/Selenium |
| HomeTest | testFeaturedPropertiesGridCount | Featured properties grid shows between 8 and 12 cards | UI | regression | Test | Java/Selenium |
| HomeTest | testGridColumnsDesktopSmall | Property grid shows 3 columns on medium desktop | UI | regression | Test | Java/Selenium |
| HomeTest | testGridColumnsDesktopWide | Property grid shows 4 columns on wide desktop | UI | regression | Test | Java/Selenium |
| HomeTest | testGridColumnsTablet | Property grid shows 2 columns on tablet viewport | UI | regression | Test | Java/Selenium |
| HomeTest | testHeroSectionHasBackgroundImage | Hero section has a background image | UI | regression | Test | Java/Selenium |
| HomeTest | testHeroSectionHeadlineText | Hero section shows correct headline text | UI | regression | Test | Java/Selenium |
| HomeTest | testHeroSectionIsDisplayed | Hero section is displayed on home page | UI | regression | Test | Java/Selenium |
| HomeTest | testPropertyCardsDetailsAreComplete | Each property card displays all required details | UI | regression | Test | Java/Selenium |

### F1.9a, F1.9b - Navbar

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| NavbarTest | testAuthenticatedNavbarVisibility |  | UI | regression | Parameterized | Java/Selenium |
| NavbarTest | testClickLoginLink | Visitor: Clicking login link navigates to login page | UI | regression | Test | Java/Selenium |
| NavbarTest | testClickLogoutInDropdownLoginLinkVisibility | After logout, login link is visible in navbar | UI | regression | Test | Java/Selenium |
| NavbarTest | testClickLogoutInDropdownRedirection | Clicking logout in dropdown redirects to home page | UI | regression | Test | Java/Selenium |
| NavbarTest | testClickProfileInDropdown | Clicking profile link in dropdown navigates to profile page | UI | regression | Test | Java/Selenium |
| NavbarTest | testClickRegisterLink | Visitor: Clicking register link navigates to register page | UI | regression | Test | Java/Selenium |
| NavbarTest | testClickWishlistsInDropdown |  | UI | regression | Test | Java/Selenium |
| NavbarTest | testNavbarDropdownNotDisplayedVisitor | Visitor: User dropdown is not displayed | UI | regression | Test | Java/Selenium |
| NavbarTest | testNavbarHamburgerMenuDisplayedOnMobileAuthenticated | Mobile: Hamburger menu is displayed when authenticated | UI | regression | Test | Java/Selenium |
| NavbarTest | testNavbarHamburgerMenuNotDisplayedOnMobileVisitor | Mobile Visitor: Hamburger menu is not displayed | UI | regression | Test | Java/Selenium |
| NavbarTest | testNavbarLoginLinkDisplayedOnMobileVisitor | Mobile Visitor: Login link is visible in navbar | UI | regression | Test | Java/Selenium |
| NavbarTest | testNavbarLogoutButtonDisplayedInDropdown | Authenticated: Logout button is displayed in user dropdown | UI | regression | Test | Java/Selenium |
| NavbarTest | testNavbarProfileLinkDisplayedInDropdown | Authenticated: Profile link is displayed in user dropdown | UI | regression | Test | Java/Selenium |
| NavbarTest | testNavbarUserAvatarDisplayedOnMobileAuthenticated |  | UI | regression | Test | Java/Selenium |
| NavbarTest | testNavbarWishlistsLinkDisplayedInDropdown | Authenticated: Wishlists link is displayed in user dropdown | UI | regression | Test | Java/Selenium |
| NavbarTest | testVisitorNavbarVisibility |  | UI | regression | Parameterized | Java/Selenium |

### F1.8a, F1.8b - Property Detail Page

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| PropertyDetailsTest | testAbsenceOfReviewsSection | Reviews section is absent on property detail page | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testAmenitiesCount | Property has 9 amenities listed | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testDescriptionNotEmpty | Property description is not empty | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testFirstImageAltText | First gallery image has alt text 'Living Room' | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testHostAvatarDisplayed | Host avatar is displayed on property detail page | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testHostMemberSincePrefix | Host section shows 'Member since' label | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testHostMemberSinceValue | Host member since shows 'March 2026' | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testHostNamePrefix | Host name includes 'Hosted by' prefix | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testHostNameValue | Host name shows 'John D.' | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testImageGalleryHasImages | Image gallery has at least one image | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testNonExistentPropertyReturns404 | Non-existent property shows 404 page | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testPriceIsPositive | Property price is a positive number | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testPropertyBathroomCount | Property displays bathroom count | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testPropertyBedCount | Property displays bed count | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testPropertyBedroomCount | Property displays bedroom count | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testPropertyGuestCapacity | Property displays guest capacity | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testPropertyLocation | Property location matches expected value | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testPropertyTitle | Property title matches expected value | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testSkiAccessAmenityPresent | Ski Access is listed in amenities | UI | regression | Test | Java/Selenium |
| PropertyDetailsTest | testWiFiAmenityPresent | WiFi is listed in amenities | UI | regression | Test | Java/Selenium |

### F1.2 - User Login (API)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| login.spec |  | empty body returns VALIDATION_ERROR | API |  | Test | TS/Playwright |
| login.spec |  | unknown email returns INVALID_CREDENTIALS | API |  | Test | TS/Playwright |
| login.spec |  | valid credentials return 200 with a JWT token and user object | API |  | Test | TS/Playwright |
| login.spec |  | wrong password returns INVALID_CREDENTIALS | API |  | Test | TS/Playwright |

### F1.1 - User Registration (API)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| register.spec |  | duplicate email returns DUPLICATE | API |  | Test | TS/Playwright |
| register.spec |  | missing email returns VALIDATION_ERROR | API |  | Test | TS/Playwright |
| register.spec |  | missing first name returns VALIDATION_ERROR | API |  | Test | TS/Playwright |
| register.spec |  | missing last name returns VALIDATION_ERROR | API |  | Test | TS/Playwright |
| register.spec |  | missing password returns VALIDATION_ERROR | API |  | Test | TS/Playwright |
| register.spec |  | valid registration returns 201 with a JWT token and user object | API |  | Test | TS/Playwright |
| register.spec |  | weak password returns VALIDATION_ERROR | API |  | Test | TS/Playwright |

### F1.2 - User Login (E2E)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| login.spec |  | Email and password are required | E2E |  | Test | TS/Playwright |
| login.spec |  | expired token logs the user out | E2E |  | Test | TS/Playwright |
| login.spec |  | invalid password should give error | E2E |  | Test | TS/Playwright |
| login.spec |  | login stores token in localStorage | E2E |  | Test | TS/Playwright |
| login.spec |  | session persists after browser restart | E2E |  | Test | TS/Playwright |
| login.spec |  | successfully logging in redirects to homepage | E2E |  | Test | TS/Playwright |

### F1.3 - User Logout (E2E)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| logout.spec |  | logged out user can visit login page | E2E |  | Test | TS/Playwright |
| logout.spec |  | logout clears the token from localStorage | E2E |  | Test | TS/Playwright |
| logout.spec |  | logout redirects to homepage | E2E |  | Test | TS/Playwright |
| logout.spec |  | logout shows logged-out UI | E2E |  | Test | TS/Playwright |
| logout.spec |  | user can log back in after logout | E2E |  | Test | TS/Playwright |

### F1.1 - User Registration (E2E)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| register.spec |  | email is required | E2E |  | Test | TS/Playwright |
| register.spec |  | first name is required | E2E |  | Test | TS/Playwright |
| register.spec |  | last name is required | E2E |  | Test | TS/Playwright |
| register.spec |  | mismatched passwords show error | E2E |  | Test | TS/Playwright |
| register.spec |  | password is required | E2E |  | Test | TS/Playwright |
| register.spec |  | password shorter than 8 characters is rejected | E2E |  | Test | TS/Playwright |
| register.spec |  | registering with an existing email shows error | E2E |  | Test | TS/Playwright |
| register.spec |  | successful registration redirects to homepage | E2E |  | Test | TS/Playwright |
| register.spec |  | user is logged in after registration | E2E |  | Test | TS/Playwright |

## Sprint 2 - Host functionality (110)

### F2.3d - Create Property API

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CreatePropertyApiTest | testCreatePropertyApiReturns201ForValidHostPayload | Create property API returns 201 for a valid host payload | API | api | Test | Java/Selenium |
| CreatePropertyApiTest | testCreatePropertyApiReturns400WhenRequiredFieldMissing | Create property API returns 400 when a required field is missing | API | api | Test | Java/Selenium |
| CreatePropertyApiTest | testCreatePropertyApiReturns403ForNonHost | Create property API returns 403 for a non-host user | API | api | Test | Java/Selenium |

### F2.7a - Image Upload

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| ImageUploadApiTest | testUploadReturns401WhenLoggedOut | Upload returns 401 when not logged in | API | api | Test | Java/Selenium |
| ImageUploadApiTest | testUploadSupportedImageReturns200AndResponseContainsUrl |  | API | api | Parameterized | Java/Selenium |
| ImageUploadApiTest | testUploadUnsupportedFileTypeReturns400 | Upload unsupported file type returns 400 | API | api | Test | Java/Selenium |
| ImageUploadApiTest | testUploadWithNoFileAttachedReturns400 | Upload with no file attached returns 400 | API | api | Test | Java/Selenium |

### F2.1 - Become a Host

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| BecomeHostApiTest | testBecomeHostApiResponseNotNull | Become host API response is not null | API | api | Test | Java/Selenium |
| BecomeHostApiTest | testBecomeHostApiResponseReflectsIsHostTrue | Become host API response reflects isHost true | API | api | Test | Java/Selenium |
| BecomeHostApiTest | testBecomeHostApiReturns401WhenLoggedOut | Become host API returns 401 when not logged in | API | api | Test | Java/Selenium |
| BecomeHostTest | testBecomeHostRedirectsToHostingFromNavbar | Become host redirect from navbar | UI | regression | Test | Java/Selenium |
| BecomeHostTest | testBecomeHostRedirectsToHostingFromProfilePage | Become host redirect from profile page | UI | regression | Test | Java/Selenium |
| BecomeHostTest | testNavbarDoesNotShowBecomeHostAfterBecomingHost | Navbar does not show 'Become a Host' after becoming a host | UI | regression | Test | Java/Selenium |
| BecomeHostTest | testNavbarDoesNotShowMyPropertiesForNonHostUser | Navbar does not show 'My Properties' for a non-host user | UI | regression | Test | Java/Selenium |
| BecomeHostTest | testNavbarShowsBecomeHostForNonHostUser | Navbar shows 'Become a Host' link for a non-host user | UI | regression | Test | Java/Selenium |
| BecomeHostTest | testNavbarShowsMyPropertiesAfterBecomingHost | Navbar shows 'My Properties' after becoming a host | UI | regression | Test | Java/Selenium |
| BecomeHostTest | testProfileShowsBecomeHostButtonForNonHostUser | Profile page shows 'Become a Host' button for non-host user | UI | regression | Test | Java/Selenium |

### F2.5 - Delete Property

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| DeletePropertyApiTest | testDeletePropertyApiReturns200ForOwner | Delete property API returns 200 for the property owner | API | api | Test | Java/Selenium |
| DeletePropertyApiTest | testDeletePropertyApiReturns401WhenLoggedOut | Delete property API returns 401 when not logged in | API | api | Test | Java/Selenium |
| DeletePropertyApiTest | testDeletePropertyApiReturns403ForNonOwner | Delete property API returns 403 for a non-owner user | API | api | Test | Java/Selenium |
| DeletePropertyApiTest | testDeletePropertyApiReturns404ForNonExistentPropertyId | Delete property API returns 404 for a non-existent property ID | API | api | Test | Java/Selenium |
| DeletePropertyTest | testCancelDeleteKeepsPropertyUnchanged | Cancelling deletion keeps the property on the dashboard | UI | regression | Test | Java/Selenium |
| DeletePropertyTest | testConfirmDeleteRemovesPropertyFromDashboard | Confirming deletion removes the property from the dashboard | UI | regression | Test | Java/Selenium |
| DeletePropertyTest | testDeleteFromDashboardShowsConfirmationModalMessage | Clicking delete on dashboard shows confirmation modal | UI | regression | Test | Java/Selenium |
| DeletePropertyTest | testDeleteFromEditPageShowsConfirmationModalMessage | Clicking delete on edit page shows confirmation modal | UI | regression | Test | Java/Selenium |

### F2.4 - Edit Property

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| EditPropertyApiTest | testEditPropertyApiReturns401WhenLoggedOut | Edit property API returns 401 when not logged in | API | api | Test | Java/Selenium |
| EditPropertyApiTest | testEditPropertyApiReturns403ForNonOwner | Edit property API returns 403 for a non-owner user | API | api | Test | Java/Selenium |
| EditPropertyApiTest | testEditPropertyApiReturns404ForNonExistentPropertyId | Edit property API returns 404 for a non-existent property ID | API | api | Test | Java/Selenium |
| EditPropertyApiTest | testEditPropertySaveReturns200ForOwner | Saving edit property returns 200 for the property owner | API | api | Test | Java/Selenium |
| EditPropertyTest | testEditPropertyPageDoesNotUseCreateWizardFlow | Edit property page is a single-page form, not a wizard | UI | regression | Test | Java/Selenium |
| EditPropertyTest | testEditPropertyPageLoadsWithPrePopulatedData | Edit property page loads with all sections and pre-populated data | UI | regression | Test | Java/Selenium |
| EditPropertyTest | testEditPropertyPageShowsAllSectionsSinglePage |  | UI | regression | Parameterized | Java/Selenium |
| EditPropertyTest | testEditPropertyPageShowsDeletePropertyButton | Edit property page shows a Delete Property button | UI | regression | Test | Java/Selenium |
| EditPropertyTest | testEditPropertyRequiredFieldValidation |  | UI | regression | Parameterized | Java/Selenium |

### F2.2 - Host Dashboard

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| HostDashboardTest | testHostDashboardCreateNewPropertyButtonLinksToCreatePage | 'Create New Property' button links to the create property page | UI | regression | Test | Java/Selenium |
| HostDashboardTest | testHostDashboardEmptyStateVisibleForHostWithNoProperties | Host dashboard shows empty state for a host with no properties | UI | regression | Test | Java/Selenium |
| HostDashboardTest | testHostDashboardPropertyCardShowsActions |  | UI | regression | Parameterized | Java/Selenium |
| HostDashboardTest | testHostDashboardPropertyCardShowsRequiredDetails |  | UI | regression | Parameterized | Java/Selenium |
| HostDashboardTest | testHostDashboardShowsCreateNewPropertyButton | Host dashboard shows 'Create New Property' button | UI | regression | Test | Java/Selenium |
| HostDashboardTest | testHostDashboardShowsPropertyCardsForHostWithProperties | Host dashboard shows property cards for a host with properties | UI | regression | Test | Java/Selenium |
| HostDashboardTest | testHostDashboardShowsSummaryCount | Host dashboard summary shows total properties count | UI | regression | Test | Java/Selenium |
| HostingPropertiesApiTest | testHostingPropertiesApiIncludesPublishedAndUnpublishedForHost | Hosting properties API includes both published and unpublished properties | API | api | Test | Java/Selenium |
| HostingPropertiesApiTest | testHostingPropertiesApiResponseNotNullForHost | Hosting properties API response is not null for a host | API | api | Test | Java/Selenium |
| HostingPropertiesApiTest | testHostingPropertiesApiReturns401WhenLoggedOut | Hosting properties API returns 401 when not logged in | API | api | Test | Java/Selenium |
| HostingPropertiesApiTest | testHostingPropertiesApiReturns403ForNonHost | Hosting properties API returns 403 for a non-host user | API | api | Test | Java/Selenium |

### F2.6 - Publish / Unpublish Property

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| PublishPropertyApiTest | testPublishPropertyApiReturns200AndIsPublishedTrueForOwner | Publish property API returns 200 and sets isPublished to true for owner | API | api | Test | Java/Selenium |
| PublishPropertyApiTest | testPublishPropertyApiReturns401WhenLoggedOut | Publish property API returns 401 when not logged in | API | api | Test | Java/Selenium |
| PublishPropertyApiTest | testPublishPropertyApiReturns403ForNonOwner | Publish property API returns 403 for a non-owner user | API | api | Test | Java/Selenium |
| PublishPropertyApiTest | testPublishPropertyApiReturns404ForNonExistentPropertyId | Publish property API returns 404 for a non-existent property ID | API | api | Test | Java/Selenium |
| PublishPropertyTest | testPublishToggleFromDashboardChangesStatusToPublished | Publish toggle from dashboard changes property status to Published | UI | regression | Test | Java/Selenium |
| PublishPropertyTest | testPublishedPropertyAppearsOnPublicListingPage | Published property appears on the public listing page | UI | regression | Test | Java/Selenium |
| PublishPropertyTest | testUnpublishedPropertyDoesNotAppearOnPublicListingPage | Unpublished property does not appear on the public listing page | UI | regression | Test | Java/Selenium |
| PublishPropertyTest | testUnpublishedPropertyStillAppearsOnHostDashboardAsDraft | Unpublished property still appears on the host dashboard as a draft | UI | regression | Test | Java/Selenium |

### F2.9a - Amenities — Host Selection

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| AmenitiesApiTest | testAmenitiesApiReturnsListWithIdNameAndIcon | Amenities API returns list with id, name, and icon fields | API | api | Test | Java/Selenium |
| PropertyAmenitiesTest | testDeselectingAmenityAndSavingRemovesItFromProperty | Deselecting an amenity and saving removes it from the property | UI | regression | Test | Java/Selenium |
| PropertyAmenitiesTest | testEditPropertyAmenitiesSectionShowsCheckboxGrid | Edit property amenities section shows a checkbox grid | UI | regression | Test | Java/Selenium |
| PropertyAmenitiesTest | testEditPropertyPreChecksSelectedAmenities | Edit property pre-checks previously selected amenities | UI | regression | Test | Java/Selenium |

### F2.8 - Property Categories

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CategoriesApiTest | testCategoriesApiReturnsListWithIdNameAndIcon | Categories API returns list with id, name, and icon fields | API | api | Test | Java/Selenium |
| PropertyCategoriesTest | testCategoryChipExists |  | UI | regression | Parameterized | Java/Selenium |
| PropertyCategoriesTest | testCreatePropertyCategoryDropdownIsPopulated | Create property category dropdown is populated with options | UI | regression | Test | Java/Selenium |
| PropertyCategoriesTest | testPropertyDetailsShowsCategoryAlongsidePropertyType | Property detail page shows category alongside property type | UI | regression | Test | Java/Selenium |
| PropertyCategoriesTest | testSelectingCategoryFiltersPropertyGrid | Selecting a category filters the property grid | UI | regression | Test | Java/Selenium |
| PropertyCategoriesTest | testSelectingCategoryMarksChipAsActive | Selecting a category chip marks it as active | UI | regression | Test | Java/Selenium |

### F2.3a - Create Property Navigation

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CreatePropertyNavigationTest | testBackFromStep2PreservesStep1Description | Going back from Step 2 preserves the Step 1 description value | UI | regression | Test | Java/Selenium |
| CreatePropertyNavigationTest | testBackFromStep2PreservesStep1Title | Going back from Step 2 preserves the Step 1 title value | UI | regression | Test | Java/Selenium |
| CreatePropertyNavigationTest | testBackFromStep3PreservesStep2City | Going back from Step 3 preserves the Step 2 city value | UI | regression | Test | Java/Selenium |
| CreatePropertyNavigationTest | testBackFromStep3PreservesStep2Country | Going back from Step 3 preserves the Step 2 country value | UI | regression | Test | Java/Selenium |

### F2.3a - Create Property Step 1

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CreatePropertyStep1Test | testNonHostAccessToCreatePropertyIsBlockedWith403 | Non-host access to the create property page is blocked with 403 | UI | regression | Test | Java/Selenium |
| CreatePropertyStep1Test | testProgressIndicatorShowsStep1Of7 | Progress indicator shows 'Step 1 of 7' on the first step | UI | regression | Test | Java/Selenium |
| CreatePropertyStep1Test | testStep1ShowsBasicsFields | Step 1 displays the Basic Information fields | UI | regression | Test | Java/Selenium |
| CreatePropertyStep1Test | testStep1ShowsValidationForMissingDescription | Step 1 shows validation error when description is missing | UI | regression | Test | Java/Selenium |
| CreatePropertyStep1Test | testStep1ShowsValidationForMissingTitle | Step 1 shows validation error when title is missing | UI | regression | Test | Java/Selenium |

### F2.3a - Create Property Step 2

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CreatePropertyStep2Test | testStep2ShowsLocationFieldsAfterCompletingStep1 | Step 2 displays Location fields after completing Step 1 | UI | regression | Test | Java/Selenium |
| CreatePropertyStep2Test | testStep2ShowsValidationForMissingField |  | UI | regression | Parameterized | Java/Selenium |

### F2.3a - Create Property Step 3

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CreatePropertyStep3Test | testStep3BathroomsAllowsHalfIncrements | Step 3 Bathrooms allows half-step increments | UI | regression | Test | Java/Selenium |
| CreatePropertyStep3Test | testStep3BathroomsMinimumIsZero | Step 3 Bathrooms minimum value is 0 | UI | regression | Test | Java/Selenium |
| CreatePropertyStep3Test | testStep3BedroomsMinimumIsZero | Step 3 Bedrooms minimum value is 0 | UI | regression | Test | Java/Selenium |
| CreatePropertyStep3Test | testStep3BedsMinimumIsOne | Step 3 Beds minimum value is 1 | UI | regression | Test | Java/Selenium |
| CreatePropertyStep3Test | testStep3MaxGuestsMinimumIsOne | Step 3 Max Guests minimum value is 1 | UI | regression | Test | Java/Selenium |
| CreatePropertyStep3Test | testStep3ShowsDetailsFieldsAfterCompletingStep2 | Step 3 displays Property Details fields after completing Step 2 | UI | regression | Test | Java/Selenium |

### F2.3b - Create Property Step 4 (Amenities)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CreatePropertyStep4Test | testStep4AllowsProceedingWithoutAmenitiesSelected | Step 4 allows proceeding to Step 5 with no amenities selected | UI | regression | Test | Java/Selenium |
| CreatePropertyStep4Test | testStep4AmenitiesGroupedByEssentials | Step 4 amenities are grouped under 'Essentials' | UI | regression | Test | Java/Selenium |
| CreatePropertyStep4Test | testStep4AmenitiesGroupedByFeatures | Step 4 amenities are grouped under 'Features' | UI | regression | Test | Java/Selenium |
| CreatePropertyStep4Test | testStep4AmenitiesGroupedBySafety | Step 4 amenities are grouped under 'Safety' | UI | regression | Test | Java/Selenium |
| CreatePropertyStep4Test | testStep4BackToStep3AndReturnPreservesAmenitySelection | Going back from Step 4 and returning preserves amenity selection | UI | regression | Test | Java/Selenium |
| CreatePropertyStep4Test | testStep4SelectedAmenitiesAllowAdvancingToStep5 | Step 4 with selected amenities allows advancing to Step 5 | UI | regression | Test | Java/Selenium |
| CreatePropertyStep4Test | testStep4ShowsAmenitiesGridAfterCompletingStep3 | Step 4 displays the Amenities grid after completing Step 3 | UI | regression | Test | Java/Selenium |

### F2.3c, F2.7b - Create Property Step 5 (Images)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CreatePropertyStep5Test | testStep5BackToStep4AndReturnPreservesUploadedImages | Step 5 going back to Step 4 and returning preserves uploaded images | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5CannotAdvanceWithoutAtLeastOneImage | Step 5 cannot advance without uploading at least one image | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5DeleteRemovesImageFromList | Step 5 deleting an image removes it from the preview list | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5DeletingOnlyImageWarnsMinimumOneRequired | Step 5 deleting the only image and proceeding warns minimum one image is required | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5DeletingPrimaryPromotesNextImageAsPrimary | Step 5 deleting the primary image promotes the next image as primary | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5FirstUploadedImageIsMarkedAsPrimaryCover | Step 5 first uploaded image is marked as the primary cover | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5PreventsAddingMoreThanTenImages | Step 5 prevents adding more than 10 images | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5ReorderingChangesPrimaryCoverToNewFirstImage | Step 5 reordering changes the primary cover to the new first image | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5ReorderingImagesUpdatesPreviewOrder | Step 5 reordering images updates the preview order | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5ShowsImageUploadAreaWithDragDropOrBrowse | Step 5 shows an image upload area with drag-and-drop or browse support | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5UploadedImagesShowSortHandleAndDeleteButton | Step 5 uploaded images show a sort handle and delete button | UI | regression | Test | Java/Selenium |
| CreatePropertyStep5Test | testStep5UploadingImagesShowsPreviewThumbnails | Step 5 uploading images shows preview thumbnails | UI | regression | Test | Java/Selenium |

### F2.3d - Create Property Step 6 (Pricing)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CreatePropertyStep6Test | testStep6NextWithValidPriceAdvancesToStep7Review | Step 6 with a valid price advances to Step 7 Review | UI | regression | Test | Java/Selenium |
| CreatePropertyStep6Test | testStep6ShowsPricePerNightInputInUsd | Step 6 shows a price-per-night input with USD label | UI | regression | Test | Java/Selenium |
| CreatePropertyStep6Test | testStep6ShowsValidationWhenPriceIsZero | Step 6 shows validation error when price is zero | UI | regression | Test | Java/Selenium |

### F2.3d - Create Property Step 7 (Review)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| CreatePropertyStep7Test | testStep7BackToStep6AndReturnToStep7Works | Step 7 going back to Step 6 and returning to Step 7 works correctly | UI | regression | Test | Java/Selenium |
| CreatePropertyStep7Test | testStep7CreatePropertyRedirectsToHostDashboard | Step 7 submitting the form redirects to the host dashboard | UI | regression | Test | Java/Selenium |
| CreatePropertyStep7Test | testStep7CreatePropertyShowsSuccessMessage | Step 7 submitting the form shows a success message | UI | regression | Test | Java/Selenium |
| CreatePropertyStep7Test | testStep7ShowsSummaryOfInformationFromPreviousSteps | Step 7 shows a summary of all information from previous steps | UI | regression | Test | Java/Selenium |

### F2.9b - Amenities — Guest Display

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| PropertyAmenityDisplayTest | testAllAmenitiesVisibleWithoutShowAllButtonForPropertyWithFewAmenities |  | UI | regression | Test | Java/Selenium |
| PropertyAmenityDisplayTest | testAmenitiesDisplayedWithIconAndLabel | Amenity items display both an icon and a label | UI | regression | Test | Java/Selenium |
| PropertyAmenityDisplayTest | testAmenitiesSectionIsHiddenForPropertyWithNoAmenities | Amenities section is hidden for a property with no amenities | UI | regression | Test | Java/Selenium |
| PropertyAmenityDisplayTest | testShowAllAmenitiesButtonAppearsForPropertyWithMoreThanEightAmenities |  | UI | regression | Test | Java/Selenium |

## Sprint 3 - Finding and saving properties (60)

### F3.2-S3 - Filter by Amenities/Bedrooms/Bathrooms

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| AmenitiesFilterTest | testAmenityFilterUpdatesResultsInRealTime | Checking an amenity checkbox updates results in real-time | UI | regression | Test | Java/Selenium |
| AmenitiesFilterTest | testBathroomFilterUpdatesResultsInRealTime |  | UI | regression | Test | Java/Selenium |
| AmenitiesFilterTest | testBedroomFilterUpdatesResultsInRealTime |  | UI | regression | Test | Java/Selenium |
| AmenitiesFilterTest | testCombinedFiltersApplyAndLogic |  | UI | regression | Test | Java/Selenium |
| AmenitiesFilterTest | testMobileFilterButtonIsVisible | A 'Filters' button is visible on mobile viewport | UI | regression | Test | Java/Selenium |
| AmenitiesFilterTest | testMobileFilterButtonOpensModal |  | UI | regression | Test | Java/Selenium |
| AmenitiesFilterTest | testNavigatingWithAmenityFilterShowsResults | Navigating with amenities filter returns matching properties | UI | regression | Test | Java/Selenium |
| AmenitiesFilterTest | testNavigatingWithBathroomFilterShowsResults | Navigating with bathrooms filter returns matching properties | UI | regression | Test | Java/Selenium |
| AmenitiesFilterTest | testNavigatingWithBedroomFilterShowsResults | Navigating with bedrooms filter returns matching properties | UI | regression | Test | Java/Selenium |

### F3.4-S1 - Paginate Search Results

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| PaginateSearchTest | testClickingNextLoadsNextPage | Clicking 'Next' navigates to the next page of results | UI | regression | Test | Java/Selenium |
| PaginateSearchTest | testClickingPreviousOnPage2LoadsPreviousPage | Clicking 'Previous' on page 2 navigates back to page 1 | UI | regression | Test | Java/Selenium |
| PaginateSearchTest | testFirstPageShowsAtMostTwentyCards | First page displays at most 20 property cards | UI | regression | Test | Java/Selenium |
| PaginateSearchTest | testNextButtonDisabledOnLastPage | 'Next' button is disabled on the last page | UI | regression | Test | Java/Selenium |
| PaginateSearchTest | testPageNumberReflectedInUrl | Navigating to page 2 reflects 'page=2' in the URL | UI | regression | Test | Java/Selenium |
| PaginateSearchTest | testPaginationInfoTextMatchesFormat | Pagination info displays 'Showing X–Y of Z results' format | UI | regression | Test | Java/Selenium |
| PaginateSearchTest | testPaginationResetsToFirstPageOnFilterChange | Changing sort while on page 2 resets pagination to page 1 | UI | regression | Test | Java/Selenium |
| PaginateSearchTest | testPreviousButtonDisabledOnFirstPage | 'Previous' button is disabled on the first page | UI | regression | Test | Java/Selenium |

### F3.2-S1 - Filter by Price Range

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| PriceFilterTest | testAllResultsAreWithinPriceRange | Every displayed property has a price within the applied min/max range | UI | regression | Test | Java/Selenium |
| PriceFilterTest | testPriceRangeShowsMatchingResults | Navigating with minPrice=50 and maxPrice=150 returns matching properties | UI | regression | Test | Java/Selenium |
| PriceFilterTest | testPriceRangeUpdatesResultsInRealTime | Setting a price range in the filter sidebar updates results in real-time | UI | regression | Test | Java/Selenium |
| PriceFilterTest | testPriceRangeWithNoMatchShowsEmptyState | A price range with no matching properties shows the empty state | UI | regression | Test | Java/Selenium |
| PriceFilterTest | testPriceRangeWithNoMatchShowsZeroCount | A price range with no matching properties shows zero results count | UI | regression | Test | Java/Selenium |

### F3.1-S2 - Search by Dates and Guests

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| SearchByDatesAndGuestsTest | testCheckInInputHasMinOfToday | Check-in date input has a minimum of today's date | UI | regression | Test | Java/Selenium |
| SearchByDatesAndGuestsTest | testCheckOutMinIsAfterCheckIn | Check-out date minimum is constrained to the day after the selected check-in date | UI | regression | Test | Java/Selenium |
| SearchByDatesAndGuestsTest | testDateFilterShowsAvailableProperties | Navigating with a date filter shows available properties | UI | regression | Test | Java/Selenium |
| SearchByDatesAndGuestsTest | testGuestFilterShowsResults | Navigating with a guest filter shows properties matching the guest count | UI | regression | Test | Java/Selenium |
| SearchByDatesAndGuestsTest | testSearchWithDatesNavigatesToFilteredUrl | Searching with check-in and check-out dates navigates to a date-filtered URL | UI | regression | Test | Java/Selenium |
| SearchByDatesAndGuestsTest | testSearchWithGuestsNavigatesToFilteredUrl | Searching with a guest count navigates to a guest-filtered URL | UI | regression | Test | Java/Selenium |
| SearchByDatesAndGuestsTest | testSearchWithNoFiltersReturnsAllPublishedProperties | Searching with no filters returns all published properties | UI | regression | Test | Java/Selenium |

### F3.1-S1 - Search by Location

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| SearchTest | testClickingCompactSearchBarExpandsForm | Clicking the compact search bar expands the search form | UI | regression | Test | Java/Selenium |
| SearchTest | testMobileCompactSearchBarIsVisible | Mobile: Compact search bar is visible in the navbar | UI | regression;mobile | Test | Java/Selenium |
| SearchTest | testSearchByCityNavigatesToFilteredUrl | Searching for a city navigates to the city-filtered URL | UI | regression | Test | Java/Selenium |
| SearchTest | testSearchByCityShowsFilteredResults | Searching for a city with matching properties shows results | UI | regression | Test | Java/Selenium |
| SearchTest | testSearchWithNonExistentCityShowsEmptyState | Searching for a city with no matching properties shows the empty state | UI | regression | Test | Java/Selenium |
| SearchTest | testSearchWithNonExistentCityShowsZeroCount | Searching for a city with no matching properties shows zero properties count | UI | regression | Test | Java/Selenium |

### F3.3-S1 - Sort Search Results

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| SortSearchResultsTest | testSortAndFilterApplyTogether | Changing sort while a price filter is active preserves both sort and filter params in URL | UI | regression | Test | Java/Selenium |
| SortSearchResultsTest | testSortByNewestResetsToDefault | Selecting 'Newest' after another sort removes the sort param from the URL | UI | regression | Test | Java/Selenium |
| SortSearchResultsTest | testSortByPriceAscendingOrdersResults | Sort by 'Price: Low to High' orders all visible properties by price ascending | UI | regression | Test | Java/Selenium |
| SortSearchResultsTest | testSortByPriceDescendingOrdersResults | Sort by 'Price: High to Low' orders all visible properties by price descending | UI | regression | Test | Java/Selenium |
| SortSearchResultsTest | testSortByTopRatedPlacesHighestRatedFirst | Sort by 'Top Rated' places the highest-rated property first | UI | regression | Test | Java/Selenium |
| SortSearchResultsTest | testSortDropdownContainsExpectedOption | Sort dropdown contains expected option label | UI | regression | Parameterized | Java/Selenium |
| SortSearchResultsTest | testSortDropdownShowsFourOptions | Sort dropdown displays exactly four sort options | UI | regression | Test | Java/Selenium |

### F3.2-S2 - Filter by Type and Category

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| TypeAndCategoryFilterTest | testCategoryFilterShowsMatchingResults | Navigating with categoryId returns only properties in that category | UI | regression | Test | Java/Selenium |
| TypeAndCategoryFilterTest | testCategoryFilterUpdatesResultsInRealTime | Selecting a category from the dropdown updates results in real-time | UI | regression | Test | Java/Selenium |
| TypeAndCategoryFilterTest | testClearingAllFiltersRestoresAllProperties | Clearing all filters restores the full property listing | UI | regression | Test | Java/Selenium |
| TypeAndCategoryFilterTest | testCombinedCategoryAndTypeFiltersApplyAndLogic | Applying category and property type together reflects both filters in the URL | UI | regression | Test | Java/Selenium |
| TypeAndCategoryFilterTest | testPropertyTypeFilterShowsMatchingResults | Navigating with propertyType=ENTIRE_PLACE returns matching properties | UI | regression | Test | Java/Selenium |
| TypeAndCategoryFilterTest | testPropertyTypeFilterUpdatesResultsInRealTime | Selecting a property type radio updates results in real-time | UI | regression | Test | Java/Selenium |

### F3.5-S1 - Add Property to Wishlist

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| AddToWishlistTest | testAddNonExistentPropertyReturns404 | Adding a non-existent property to wishlist returns 404 | UI | regression | Test | Java/Selenium |
| AddToWishlistTest | testClickHeartOnCardFillsHeart | Clicking outline heart on property card fills the heart | UI | regression | Test | Java/Selenium |
| AddToWishlistTest | testClickHeartOnDetailPageFillsHeart | Clicking outline heart on property detail page fills the heart | UI | regression | Test | Java/Selenium |
| AddToWishlistTest | testPropertyAlreadyInWishlistShowsFilledHeart | Property already in wishlist shows filled heart on detail page | UI | regression | Test | Java/Selenium |
| AddToWishlistTest | testUnauthenticatedClickRedirectsToLogin | Clicking heart when not authenticated redirects to login page | UI | regression | Test | Java/Selenium |

### F3.5-S2 - Remove Property from Wishlist

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| RemoveFromWishlistTest | testClickFilledHeartOnCardBecomesOutline | Clicking filled heart on property card turns heart back to outline | UI | regression | Test | Java/Selenium |
| RemoveFromWishlistTest | testClickFilledHeartOnDetailPageBecomesOutline | Clicking filled heart on property detail page turns heart back to outline | UI | regression | Test | Java/Selenium |
| RemoveFromWishlistTest | testClickHeartOnWishlistPageRemovesCard | Clicking heart on wishlists page removes the property card | UI | regression | Test | Java/Selenium |
| RemoveFromWishlistTest | testRemoveNonWishlistedPropertyReturns404 | Removing a property not in the wishlist returns 404 | UI | regression | Test | Java/Selenium |

### F3.5-S3 - View Wishlist Page

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| ViewWishlistTest | testAuthenticatedUserWithPropertiesSeesGridWithFilledHearts |  | UI | regression | Test | Java/Selenium |
| ViewWishlistTest | testEmptyWishlistShowsEmptyStateMessage |  | UI | regression | Test | Java/Selenium |
| ViewWishlistTest | testUnauthenticatedUserSeesLoginPrompt |  | UI | regression | Test | Java/Selenium |

## Sprint 4 - Making and managing reservations (54)

### F4.2 - Availability API

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| AvailabilityApiTest | testBookedPropertyHasBookedDates | Booked property has booked dates | API | api | Test | Java/Selenium |
| AvailabilityApiTest | testUnbookedPropertyHasEmptyBookedDates | Unbooked property has empty booked dates | API | api | Test | Java/Selenium |

### F4.2, F4.3, F4.8 - Booking API

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| BookingApiTest | testBookingOverlappingDatesReturns409 | Visitor user Booking overlapping dates returns 401 | API | api | Test | Java/Selenium |
| BookingApiTest | testLoggedInUserBookingOverlappingDatesReturns409 | Logged-in user booking overlapping dates returns 409 | API | api | Test | Java/Selenium |
| BookingApiTest | testLoggedInUserBookingValidDatesReturnsPendingStatus | Logged-in user booking valid dates returns PENDING status | API | api | Test | Java/Selenium |
| BookingApiTest | testNewBookingAppearsInHostActiveNotifications | New booking by non-host user appears in host's active notifications | API | api | Test | Java/Selenium |

### F4.3 - Booking Validation

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| BookingValidationApiTest | testGuestCountExceedsMaxReturns400 | Booking with guest count exceeding property max returns 400 | API | api | Test | Java/Selenium |
| BookingValidationApiTest | testInvalidDateRangeReturns400 | Booking with invalid date range returns 400 | API | api | Parameterized | Java/Selenium |
| BookingValidationApiTest | testMissingRequiredFieldReturns400 | Booking with a missing required field returns 400 | API | api | Parameterized | Java/Selenium |
| BookingValidationApiTest | testUnauthenticatedBookingReturns401 | Unauthenticated booking request returns 401 | API | api | Test | Java/Selenium |

### F4.2 - Availability Calendar

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| AvailabilityCalendarTest | testBookedDatesAreDisabled |  | UI | regression | Test | Java/Selenium |
| AvailabilityCalendarTest | testUnbookedDatesAreSelectable | Unbooked dates are selectable in the date picker | UI | regression | Test | Java/Selenium |

### F4.1, F4.3 - Booking Widget

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| BookingWidgetTest | testBookingWidgetDisplaysPricePerNight | Booking widget displays the property price per night on page load | UI | regression | Test | Java/Selenium |
| BookingWidgetTest | testBookingWidgetHasAllRequiredControls | Booking widget displays check-in picker, check-out picker, guest selector, and Reserve button | UI | regression | Test | Java/Selenium |
| BookingWidgetTest | testGuestCountDefaultsToOne | Guest count defaults to 1 when booking widget loads | UI | regression | Test | Java/Selenium |
| BookingWidgetTest | testIncrementButtonDisabledAtMaxCapacity | Increment button is disabled after reaching the property's max guest capacity | UI | regression | Test | Java/Selenium |
| BookingWidgetTest | testPriceBreakdownDisplayedAfterDatesSelected | Price breakdown is displayed after valid check-in and check-out dates are selected | UI | regression | Test | Java/Selenium |
| BookingWidgetTest | testReserveWithoutAuthShowsBookingWidgetError | Clicking Reserve without authentication shows an inline error in the booking widget | UI | regression | Test | Java/Selenium |
| BookingWidgetTest | testReservingValidPropertyAppearsInBookingTab | Reserving a valid property booking gets it into the bookings tab | UI | regression | Test | Java/Selenium |
| BookingWidgetTest | testReservingValidPropertySendsNotificationToTheHost | Reserving a valid property sends a notification to the host | UI | regression | Test | Java/Selenium |

### F4.2; F4.3; F4.8 - Booking Creation (API)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| booking-creation.spec |  | creates a booking with PENDING status and returns all required fields | API |  | Test | TS/Playwright |
| booking-creation.spec |  | host receives a BOOKING_REQUEST notification after booking | API |  | Test | TS/Playwright |
| booking-creation.spec |  | returns 400 when checkIn date is in the past | API |  | Test | TS/Playwright |
| booking-creation.spec |  | returns 400 when numGuests exceeds property max guests | API |  | Test | TS/Playwright |
| booking-creation.spec |  | returns 401 when request is unauthenticated | API |  | Test | TS/Playwright |
| booking-creation.spec |  | returns 409 when dates overlap with an existing booking | API |  | Test | TS/Playwright |

### F4.7; F4.8 - Host Booking Requests (API)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| booking-requests.spec |  | confirms a PENDING booking | API |  | Test | TS/Playwright |
| booking-requests.spec |  | declines a PENDING booking | API |  | Test | TS/Playwright |
| booking-requests.spec |  | guest receives a BOOKING_CONFIRMED notification after host confirms | API |  | Test | TS/Playwright |
| booking-requests.spec |  | guest receives a BOOKING_DECLINED notification after host declines | API |  | Test | TS/Playwright |
| booking-requests.spec |  | returns 403 for a non-host user | API |  | Test | TS/Playwright |
| booking-requests.spec |  | returns 403 when a non-host attempts to confirm | API |  | Test | TS/Playwright |
| booking-requests.spec |  | returns 403 when a non-host attempts to decline | API |  | Test | TS/Playwright |

### F4.4; F4.5; F4.6; F4.8 - Guest Bookings (API)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| mybooking.spec |  | cancels a PENDING booking | API |  | Test | TS/Playwright |
| mybooking.spec |  | host receives a BOOKING_CANCELLED notification after guest cancels | API |  | Test | TS/Playwright |
| mybooking.spec |  | returns 403 when a different user attempts the cancellation | API |  | Test | TS/Playwright |
| mybooking.spec |  | returns 403 when booking belongs to another user | API |  | Test | TS/Playwright |
| mybooking.spec |  | returns full booking detail for a valid booking | API |  | Test | TS/Playwright |
| mybooking.spec |  | returns pending bookings with pagination | API |  | Test | TS/Playwright |

### F4.3; F4.6; F4.7; F4.8 - Booking Flow (E2E)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| booking.spec |  | Cancelling a reservation moves it to the cancelled tab | E2E |  | Test | TS/Playwright |
| booking.spec |  | Cancelling a reservation notifies the host | E2E |  | Test | TS/Playwright |
| booking.spec |  | Guest's booking shows CONFIRMED status in upcoming after host confirms | E2E |  | Test | TS/Playwright |
| booking.spec |  | Guest's booking shows DECLINED status after host declines | E2E |  | Test | TS/Playwright |
| booking.spec |  | Host confirming a booking moves it to the Confirmed tab | E2E |  | Test | TS/Playwright |
| booking.spec |  | Host confirming a booking notifies the guest | E2E |  | Test | TS/Playwright |
| booking.spec |  | Host declining a booking notifies the guest | E2E |  | Test | TS/Playwright |
| booking.spec |  | Host declining a booking removes it from the pending tab | E2E |  | Test | TS/Playwright |
| booking.spec |  | Pending booking request is visible to the host | E2E |  | Test | TS/Playwright |
| booking.spec |  | Reserving a property notifies the host | E2E |  | Test | TS/Playwright |
| booking.spec |  | Reserving a valid property appears in upcoming bookings | E2E |  | Test | TS/Playwright |

### F4.1 - Booking Widget (E2E)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| widget.spec |  | Booking widget is displayed | E2E |  | Test | TS/Playwright |
| widget.spec |  | Clicking reserve without authentication redirects to login | E2E |  | Test | TS/Playwright |
| widget.spec |  | Increment button is disabled after reaching property's max guest capacity | E2E |  | Test | TS/Playwright |
| widget.spec |  | Price breakdown is displayed after valid checkin and checkout dates are selected | E2E |  | Test | TS/Playwright |

## Sprint 4, 5 - Notifications (cross-sprint: booking + social) (6)

### F4.8; F5.8 - Notifications (API)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| notifications.spec |  | flips is_read to true for a valid notification ID | API |  | Test | TS/Playwright |
| notifications.spec |  | marks all as read then GET returns unreadCount 0 | API |  | Test | TS/Playwright |
| notifications.spec |  | returns 200 with a notifications list and unreadCount | API |  | Test | TS/Playwright |
| notifications.spec |  | returns 401 for an unauthenticated mark-all-as-read request | API |  | Test | TS/Playwright |
| notifications.spec |  | returns 404 for a non-existent notification ID | API |  | Test | TS/Playwright |
| notifications.spec |  | returns only unread notifications when unreadOnly=true | API |  | Test | TS/Playwright |

## Sprint 5 - Social features: reviews, messaging, notifications (39)

### F5.5; F5.6; F5.7 - Messaging (API)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| messages.spec |  | guest sends a message to host with a propertyId and receives 201 | API |  | Test | TS/Playwright |
| messages.spec |  | marks conversation as read and unread count drops to 0 | API |  | Test | TS/Playwright |
| messages.spec |  | returns 200 with correct conversation shape | API |  | Test | TS/Playwright |
| messages.spec |  | returns 400 when content is empty | API |  | Test | TS/Playwright |
| messages.spec |  | returns 400 when sender and receiver are the same user | API |  | Test | TS/Playwright |
| messages.spec |  | returns 403 when a non-participant tries to mark a conversation as read | API |  | Test | TS/Playwright |

### F5.1; F5.2 - Reviews (API)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| reviews.spec |  | guest submits a valid GUEST_TO_PROPERTY review and receives 201 | API |  | Fixme | TS/Playwright |
| reviews.spec |  | host submits a valid HOST_TO_GUEST review and receives 201 | API |  | Fixme | TS/Playwright |
| reviews.spec |  | returns 400 for a rating of 0 (below valid range) | API |  | Fixme | TS/Playwright |
| reviews.spec |  | returns 400 for a rating of 6 (above valid range) | API |  | Fixme | TS/Playwright |
| reviews.spec |  | returns 403 when a non-participant submits a review | API |  | Fixme | TS/Playwright |
| reviews.spec |  | returns 409 when a review already exists for the same booking and type | API |  | Fixme | TS/Playwright |

### F5.5 - Send Message (E2E)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| message.spec |  | guest sending a message from messages page appears in host messages page | E2E |  | Test | TS/Playwright |
| message.spec |  | guest sending a message from property details page appears in guest messages page | E2E |  | Test | TS/Playwright |
| message.spec |  | guest sending a message from property details page appears in host messages page | E2E |  | Test | TS/Playwright |

### F5.6; F5.7 - Messages Page (E2E)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| messages-page.spec |  | clicking a conversation opens the thread | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | conversation list is displayed | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | each conversation shows a timestamp | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | each conversation shows last message preview | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | each conversation shows the other user name | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | each conversation shows the related property name | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | each message shows text and timestamp | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | received messages are displayed in the thread | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | sent messages are displayed in the thread | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | shows empty state when user has no conversations | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | thread auto-scrolls to the newest message | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | thread header shows the other user name | E2E |  | Test | TS/Playwright |
| messages-page.spec |  | thread header shows the related property | E2E |  | Test | TS/Playwright |

### F5.8 - Notification Bell (E2E)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| notification-bell.spec |  | badge is hidden when user has no unread notifications | E2E |  | Test | TS/Playwright |
| notification-bell.spec |  | bell badge shows unread count when user has unread notifications | E2E |  | Test | TS/Playwright |
| notification-bell.spec |  | bell icon is visible when logged in | E2E |  | Test | TS/Playwright |
| notification-bell.spec |  | bell is not visible when logged out | E2E |  | Test | TS/Playwright |

### F5.8 - Notifications Page (E2E)

| Class | Method | Display Name | Layer | Tags | Kind | Framework |
|---|---|---|---|---|---|---|
| notifications-page.spec |  | bell badge disappears after marking all as read | E2E |  | Test | TS/Playwright |
| notifications-page.spec |  | clicking a message notification navigates to messages | E2E |  | Test | TS/Playwright |
| notifications-page.spec |  | mark all as read clears all unread cards | E2E |  | Test | TS/Playwright |
| notifications-page.spec |  | read notifications do not show the unread indicator | E2E |  | Test | TS/Playwright |
| notifications-page.spec |  | redirects to login when not authenticated | E2E |  | Test | TS/Playwright |
| notifications-page.spec |  | shows empty state when user has no notifications | E2E |  | Test | TS/Playwright |
| notifications-page.spec |  | unread notifications show the unread indicator | E2E |  | Test | TS/Playwright |

