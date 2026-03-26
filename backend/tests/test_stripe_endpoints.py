"""
Stripe Payment Endpoints Tests
Tests for Stripe checkout, campaign prices, and payment status endpoints
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://social-earnings-11.preview.emergentagent.com').rstrip('/')

# Test origin URL for Stripe redirects
TEST_ORIGIN = "https://social-earnings-11.preview.emergentagent.com"


class TestCampaignPrices:
    """Campaign pricing endpoint tests"""
    
    def test_get_campaign_prices_returns_200(self):
        """Test GET /api/stripe/campaign-prices returns 200"""
        response = requests.get(f"{BASE_URL}/api/stripe/campaign-prices")
        assert response.status_code == 200
        print("Campaign prices endpoint returned 200")
    
    def test_campaign_prices_structure(self):
        """Test campaign prices response has correct structure"""
        response = requests.get(f"{BASE_URL}/api/stripe/campaign-prices")
        data = response.json()
        
        # Check top-level keys
        assert "currency" in data
        assert "vat_rate" in data
        assert "prices" in data
        
        # Check currency is GBP
        assert data["currency"] == "GBP"
        
        # Check VAT rate is 20%
        assert data["vat_rate"] == 0.2
        print(f"Currency: {data['currency']}, VAT Rate: {data['vat_rate']}")
    
    def test_campaign_prices_has_three_durations(self):
        """Test campaign prices has 1_week, 1_month, 3_months"""
        response = requests.get(f"{BASE_URL}/api/stripe/campaign-prices")
        data = response.json()
        
        prices = data["prices"]
        assert "1_week" in prices
        assert "1_month" in prices
        assert "3_months" in prices
        print(f"Durations available: {list(prices.keys())}")
    
    def test_campaign_prices_correct_values(self):
        """Test campaign prices have correct base prices"""
        response = requests.get(f"{BASE_URL}/api/stripe/campaign-prices")
        data = response.json()
        prices = data["prices"]
        
        # Check 1 week price
        assert prices["1_week"]["base_price"] == 49.99
        assert prices["1_week"]["vat"] == 10.0
        assert prices["1_week"]["total"] == 59.99
        
        # Check 1 month price
        assert prices["1_month"]["base_price"] == 149.99
        assert prices["1_month"]["vat"] == 30.0
        assert prices["1_month"]["total"] == 179.99
        
        # Check 3 months price
        assert prices["3_months"]["base_price"] == 349.99
        assert prices["3_months"]["vat"] == 70.0
        assert prices["3_months"]["total"] == 419.99
        
        print("All campaign prices verified correctly")


class TestInfluencerCheckout:
    """Influencer subscription checkout tests"""
    
    def test_influencer_checkout_returns_url(self):
        """Test POST /api/stripe/checkout/influencer-subscription returns checkout URL"""
        response = requests.post(
            f"{BASE_URL}/api/stripe/checkout/influencer-subscription",
            json={"origin_url": TEST_ORIGIN}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Check response has url and session_id
        assert "url" in data
        assert "session_id" in data
        
        # Verify URL starts with Stripe checkout
        assert data["url"].startswith("https://checkout.stripe.com")
        
        # Verify session_id format
        assert data["session_id"].startswith("cs_test_")
        
        print(f"Influencer checkout URL generated: {data['url'][:60]}...")
        print(f"Session ID: {data['session_id']}")
    
    def test_influencer_checkout_missing_origin(self):
        """Test influencer checkout fails without origin_url"""
        response = requests.post(
            f"{BASE_URL}/api/stripe/checkout/influencer-subscription",
            json={}
        )
        
        # Should return 422 (validation error) for missing required field
        assert response.status_code == 422
        print("Missing origin_url correctly returns 422")


class TestCampaignCheckout:
    """Campaign payment checkout tests"""
    
    def test_campaign_checkout_1_week(self):
        """Test campaign checkout with 1_week duration"""
        response = requests.post(
            f"{BASE_URL}/api/stripe/checkout/campaign",
            json={
                "origin_url": TEST_ORIGIN,
                "campaign_id": "test_campaign_1",
                "duration": "1_week"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "url" in data
        assert "session_id" in data
        assert data["url"].startswith("https://checkout.stripe.com")
        
        print(f"1 week campaign checkout URL generated")
    
    def test_campaign_checkout_1_month(self):
        """Test campaign checkout with 1_month duration"""
        response = requests.post(
            f"{BASE_URL}/api/stripe/checkout/campaign",
            json={
                "origin_url": TEST_ORIGIN,
                "campaign_id": "test_campaign_2",
                "duration": "1_month"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "url" in data
        assert "session_id" in data
        assert data["url"].startswith("https://checkout.stripe.com")
        
        print(f"1 month campaign checkout URL generated")
    
    def test_campaign_checkout_3_months(self):
        """Test campaign checkout with 3_months duration"""
        response = requests.post(
            f"{BASE_URL}/api/stripe/checkout/campaign",
            json={
                "origin_url": TEST_ORIGIN,
                "campaign_id": "test_campaign_3",
                "duration": "3_months"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "url" in data
        assert "session_id" in data
        assert data["url"].startswith("https://checkout.stripe.com")
        
        print(f"3 months campaign checkout URL generated")
    
    def test_campaign_checkout_invalid_duration(self):
        """Test campaign checkout with invalid duration returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/stripe/checkout/campaign",
            json={
                "origin_url": TEST_ORIGIN,
                "campaign_id": "test_campaign_invalid",
                "duration": "2_weeks"
            }
        )
        
        assert response.status_code == 400
        data = response.json()
        
        # Check error message mentions valid durations
        assert "Invalid duration" in data.get("detail", "")
        print(f"Invalid duration correctly returns 400: {data.get('detail')}")
    
    def test_campaign_checkout_missing_campaign_id(self):
        """Test campaign checkout fails without campaign_id"""
        response = requests.post(
            f"{BASE_URL}/api/stripe/checkout/campaign",
            json={
                "origin_url": TEST_ORIGIN,
                "duration": "1_month"
            }
        )
        
        # Should return 422 (validation error) for missing required field
        assert response.status_code == 422
        print("Missing campaign_id correctly returns 422")
    
    def test_campaign_checkout_missing_duration(self):
        """Test campaign checkout fails without duration"""
        response = requests.post(
            f"{BASE_URL}/api/stripe/checkout/campaign",
            json={
                "origin_url": TEST_ORIGIN,
                "campaign_id": "test_campaign"
            }
        )
        
        # Should return 422 (validation error) for missing required field
        assert response.status_code == 422
        print("Missing duration correctly returns 422")


class TestCheckoutStatus:
    """Checkout status endpoint tests"""
    
    def test_checkout_status_invalid_session(self):
        """Test checkout status with invalid session ID"""
        response = requests.get(
            f"{BASE_URL}/api/stripe/checkout-status/invalid_session_id"
        )
        
        # Should return error for invalid session
        # Stripe API will return an error for non-existent session
        assert response.status_code in [400, 404, 500]
        print(f"Invalid session status returned: {response.status_code}")
    
    def test_checkout_status_valid_session(self):
        """Test checkout status with a valid session from checkout creation"""
        # First create a checkout session
        checkout_response = requests.post(
            f"{BASE_URL}/api/stripe/checkout/influencer-subscription",
            json={"origin_url": TEST_ORIGIN}
        )
        
        assert checkout_response.status_code == 200
        session_id = checkout_response.json()["session_id"]
        
        # Now check the status
        status_response = requests.get(
            f"{BASE_URL}/api/stripe/checkout-status/{session_id}"
        )
        
        assert status_response.status_code == 200
        data = status_response.json()
        
        # Check response structure
        assert "status" in data
        assert "payment_status" in data
        
        # New session should be "open" and "unpaid"
        assert data["status"] == "open"
        assert data["payment_status"] == "unpaid"
        
        print(f"Checkout status: {data['status']}, Payment: {data['payment_status']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
