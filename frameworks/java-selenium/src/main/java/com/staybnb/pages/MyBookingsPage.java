package com.staybnb.pages;

import com.staybnb.config.AppConstants;
import com.staybnb.locators.Locators;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class MyBookingsPage extends BasePage {

    public MyBookingsPage(WebDriver driver) {
        super(driver);
    }

    public void navigateTo() {
        super.navigateTo(AppConstants.BOOKINGS_URL);
        waitForElementVisible(Locators.MyBookings.PAGE_TITLE);
    }

    public String getBookingId(WebElement element) {
        String url = element.getAttribute("href");
       return url.substring(url.lastIndexOf("/") + 1);
    }

    public boolean doesBookingExist(String bookingId) {
        navigateTo();
        List<WebElement> cards = waitForElementsPresent(Locators.MyBookings.BOOKING_CARD);
        return  cards.stream()
                .anyMatch(card ->
                        getBookingId(card).equals(bookingId)
                );
    }

    public void cancelBookingViaApi(String bookingId) {
        apiRequest().put("/bookings/" + bookingId + "/cancel");
    }
}
