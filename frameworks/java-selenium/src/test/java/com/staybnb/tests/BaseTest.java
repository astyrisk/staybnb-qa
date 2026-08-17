package com.staybnb.tests;

import com.staybnb.config.AppConstants;
import com.staybnb.config.DriverFactory;
import com.staybnb.config.TestConfig;
import com.staybnb.extensions.RetryExtension;
import com.staybnb.extensions.ScreenshotOnFailureExtension;
import com.staybnb.locators.Locators;
import com.staybnb.pages.LoginPage;
import com.staybnb.pages.LogoutPage;
import com.staybnb.pages.RegisterPage;
import io.qameta.allure.junit5.AllureJunit5;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.WebDriver;

@ExtendWith({AllureJunit5.class, ScreenshotOnFailureExtension.class, RetryExtension.class})
public class BaseTest {
    protected WebDriver driver;

    @BeforeEach
    public void commonSetup() {
        driver = DriverFactory.createDriver();
    }

    protected void registerNewUser() {
        RegisterPage registerPage = new RegisterPage(driver);
        registerPage.navigateViaNavbar();

        String uniqueEmail = "registerTestUser_" + System.currentTimeMillis() + "@gmail.com";

        registerPage.registerAndWaitForUrl(
            TestConfig.HOST_TEST_USER_FIRST_NAME,
            TestConfig.HOST_TEST_USER_LAST_NAME,
            uniqueEmail,
            TestConfig.HOST_TEST_PASSWORD,
            AppConstants.HOME_URL
        );
    }

    protected LoginPage loginAsHostUser() {
        return new LoginPage(driver)
                .navigateViaNavbar()
                .loginAndExpectSuccess(TestConfig.HOST_TEST_USER_EMAIL, TestConfig.HOST_TEST_PASSWORD);
    }

    protected LoginPage loginAsNonHostUser() {
        return new LoginPage(driver)
                .navigateViaNavbar()
                .loginAndExpectSuccess(TestConfig.NON_HOST_TEST_USER_EMAIL, TestConfig.NON_HOST_TEST_PASSWORD);
    }

    protected void logout() {
        new LogoutPage(driver).logout();
    }
}
