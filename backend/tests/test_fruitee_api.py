"""
Fruitee API Backend Tests
Tests for auth, user profile, business onboarding, influencer onboarding, brands, and campaigns
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://social-earnings-11.preview.emergentagent.com').rstrip('/')

# Generate unique test identifiers
TEST_ID = str(int(time.time()))


class TestAuthBusiness:
    """Business registration and login tests"""
    
    @pytest.fixture(scope="class")
    def business_user(self):
        """Register a new business user and return credentials"""
        email = f"test_biz_{TEST_ID}@test.com"
        password = "TestPass123!"
        
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register/business",
            json={"email": email, "password": password}
        )
        
        assert response.status_code == 200, f"Business registration failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert data["data"]["role"] == "business"
        
        return {
            "email": email,
            "password": password,
            "access_token": data["data"]["access_token"],
            "refresh_token": data["data"]["refresh_token"],
            "user_id": data["data"]["id"]
        }
    
    def test_business_registration_returns_tokens(self, business_user):
        """Verify business registration returns valid tokens"""
        assert business_user["access_token"] is not None
        assert len(business_user["access_token"]) > 50
        print(f"Business user registered: {business_user['email']}")
    
    def test_business_login(self, business_user):
        """Test business user can login with credentials"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": business_user["email"], "password": business_user["password"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        print("Business login successful")
    
    def test_get_me_business(self, business_user):
        """Test GET /api/v1/users/me for business user"""
        headers = {"Authorization": f"Bearer {business_user['access_token']}"}
        response = requests.get(f"{BASE_URL}/api/v1/users/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["email"] == business_user["email"]
        assert data["data"]["role"] == "business"
        print(f"GET /users/me returned: {data['data']['email']}")


class TestAuthInfluencer:
    """Influencer registration and login tests"""
    
    @pytest.fixture(scope="class")
    def influencer_user(self):
        """Register a new influencer user and return credentials"""
        email = f"test_inf_{TEST_ID}@test.com"
        password = "TestPass123!"
        
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register/influencer",
            json={"email": email, "password": password}
        )
        
        assert response.status_code == 200, f"Influencer registration failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert data["data"]["role"] == "influencer"
        
        return {
            "email": email,
            "password": password,
            "access_token": data["data"]["access_token"],
            "refresh_token": data["data"]["refresh_token"],
            "user_id": data["data"]["id"]
        }
    
    def test_influencer_registration_returns_tokens(self, influencer_user):
        """Verify influencer registration returns valid tokens"""
        assert influencer_user["access_token"] is not None
        assert len(influencer_user["access_token"]) > 50
        print(f"Influencer user registered: {influencer_user['email']}")
    
    def test_influencer_login(self, influencer_user):
        """Test influencer user can login with credentials"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": influencer_user["email"], "password": influencer_user["password"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        print("Influencer login successful")
    
    def test_get_me_influencer(self, influencer_user):
        """Test GET /api/v1/users/me for influencer user"""
        headers = {"Authorization": f"Bearer {influencer_user['access_token']}"}
        response = requests.get(f"{BASE_URL}/api/v1/users/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["email"] == influencer_user["email"]
        assert data["data"]["role"] == "influencer"
        print(f"GET /users/me returned: {data['data']['email']}")


class TestBusinessProfile:
    """Business profile update tests"""
    
    @pytest.fixture(scope="class")
    def business_auth(self):
        """Create business user for profile tests"""
        email = f"test_biz_profile_{TEST_ID}@test.com"
        password = "TestPass123!"
        
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register/business",
            json={"email": email, "password": password}
        )
        data = response.json()
        return {"Authorization": f"Bearer {data['data']['access_token']}"}
    
    def test_update_business_profile(self, business_auth):
        """Test PUT /api/v1/users/me/business-profile"""
        profile_data = {
            "name": "Test Business Inc",
            "contact_name": "John Doe",
            "website": "https://testbusiness.com",
            "mobile": "+1234567890",
            "address": "New York, US"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/v1/users/me/business-profile",
            headers=business_auth,
            json=profile_data
        )
        
        assert response.status_code == 200, f"Business profile update failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        print("Business profile updated successfully")
    
    def test_verify_business_profile_persisted(self, business_auth):
        """Verify business profile data persisted via GET /users/me"""
        response = requests.get(f"{BASE_URL}/api/v1/users/me", headers=business_auth)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        
        # Check business_profile exists
        bp = data["data"].get("business_profile", {})
        assert bp.get("name") == "Test Business Inc"
        print(f"Business profile verified: {bp.get('name')}")


class TestInfluencerProfile:
    """Influencer profile update tests"""
    
    @pytest.fixture(scope="class")
    def influencer_auth(self):
        """Create influencer user for profile tests"""
        email = f"test_inf_profile_{TEST_ID}@test.com"
        password = "TestPass123!"
        
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register/influencer",
            json={"email": email, "password": password}
        )
        data = response.json()
        return {"Authorization": f"Bearer {data['data']['access_token']}"}
    
    def test_update_influencer_profile(self, influencer_auth):
        """Test PUT /api/v1/users/me/influencer-profile"""
        profile_data = {
            "name": "Test Influencer",
            "display_name": "@testinfluencer",
            "gender": "male",
            "age": 25,
            "dob": "2000-01-15T00:00:00Z",
            "country": "US",
            "city": "Los Angeles",
            "language": "english",
            "bio": "Test bio for influencer"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/v1/users/me/influencer-profile",
            headers=influencer_auth,
            json=profile_data
        )
        
        assert response.status_code == 200, f"Influencer profile update failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        print("Influencer profile updated successfully")
    
    def test_verify_influencer_profile_persisted(self, influencer_auth):
        """Verify influencer profile data persisted via GET /users/me"""
        response = requests.get(f"{BASE_URL}/api/v1/users/me", headers=influencer_auth)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        
        # Check influencer_profile exists
        ip = data["data"].get("influencer_profile", {})
        assert ip.get("display_name") == "@testinfluencer"
        print(f"Influencer profile verified: {ip.get('display_name')}")


class TestBusinessOnboarding:
    """Business onboarding/preferences tests"""
    
    @pytest.fixture(scope="class")
    def business_auth(self):
        """Create business user for onboarding tests"""
        email = f"test_biz_onboard_{TEST_ID}@test.com"
        password = "TestPass123!"
        
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register/business",
            json={"email": email, "password": password}
        )
        data = response.json()
        return {"Authorization": f"Bearer {data['data']['access_token']}"}
    
    def test_get_onboard_questions(self, business_auth):
        """Test GET /api/v1/businesses/onboard/questions"""
        response = requests.get(
            f"{BASE_URL}/api/v1/businesses/onboard/questions",
            headers=business_auth
        )
        
        # May return 200 or 404 depending on API implementation
        assert response.status_code in [200, 404], f"Unexpected status: {response.status_code}"
        print(f"Business onboard questions status: {response.status_code}")
    
    def test_submit_business_onboarding(self, business_auth):
        """Test POST /api/v1/businesses/onboard"""
        onboard_data = {
            "consent_business_details": True,
            "understands_marketing_assistance": True,
            "understands_featuring_influencer": True,
            "understands_content_remaining_live": True,
            "allowed_categories": ["Fashion & Apparel", "Beauty & Personal Care"],
            "preferred_tones": ["Professional / Educational"],
            "brand_positioning": ["Educational: Through tutorials, tips, and insights"],
            "audience_type": ["Young adults (18-30)"],
            "understands_pausing_participation": True,
            "category_preferences": {},
            "understands_automated_matching": True,
            "understands_shown_campaigns": True,
            "allowed_regions": ["UK", "US"]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/businesses/onboard",
            headers=business_auth,
            json=onboard_data
        )
        
        assert response.status_code == 200, f"Business onboarding failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        print("Business onboarding submitted successfully")


class TestInfluencerOnboarding:
    """Influencer onboarding/preferences tests"""
    
    @pytest.fixture(scope="class")
    def influencer_auth(self):
        """Create influencer user for onboarding tests"""
        email = f"test_inf_onboard_{TEST_ID}@test.com"
        password = "TestPass123!"
        
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register/influencer",
            json={"email": email, "password": password}
        )
        data = response.json()
        return {"Authorization": f"Bearer {data['data']['access_token']}"}
    
    def test_submit_influencer_onboarding(self, influencer_auth):
        """Test POST /api/v1/influencers/onboard"""
        onboard_data = {
            "consent_name": True,
            "consent_likeness": True,
            "consent_voice": True,
            "consent_category_limits": True,
            "consent_pause_participation": True,
            "consent_identified_as_ai": True,
            "consent_remains_live": True,
            "allowed_categories": ["Fashion & Apparel", "Lifestyle & Home"],
            "preferred_tones": ["Playful / Lighthearted"],
            "brand_positioning": ["Inspirational/Entertaining: Stories, quotes, or entertaining content"],
            "audience_type": ["Young adults (18-30)"],
            "understands_pausing_participation": True,
            "category_preferences": {},
            "understands_shown_campaigns": True,
            "understands_automated_matching": True,
            "allowed_regions": ["Global / No restriction"]
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/influencers/onboard",
            headers=influencer_auth,
            json=onboard_data
        )
        
        assert response.status_code == 200, f"Influencer onboarding failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        print("Influencer onboarding submitted successfully")


class TestBrands:
    """Brand CRUD tests"""
    
    @pytest.fixture(scope="class")
    def business_auth(self):
        """Create business user for brand tests"""
        email = f"test_biz_brands_{TEST_ID}@test.com"
        password = "TestPass123!"
        
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register/business",
            json={"email": email, "password": password}
        )
        data = response.json()
        return {"Authorization": f"Bearer {data['data']['access_token']}"}
    
    @pytest.fixture(scope="class")
    def created_brand(self, business_auth):
        """Create a brand and return its ID"""
        response = requests.post(
            f"{BASE_URL}/api/v1/brands",
            headers=business_auth,
            json={"name": f"Test Brand {TEST_ID}"}
        )
        
        assert response.status_code == 200, f"Brand creation failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        return data["data"]
    
    def test_create_brand(self, created_brand):
        """Verify brand was created"""
        assert "id" in created_brand
        assert created_brand["name"] == f"Test Brand {TEST_ID}"
        print(f"Brand created: {created_brand['name']} (ID: {created_brand['id']})")
    
    def test_list_brands(self, business_auth, created_brand):
        """Test GET /api/v1/brands"""
        response = requests.get(
            f"{BASE_URL}/api/v1/brands",
            headers=business_auth
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        
        # Verify our brand is in the list - handle different response formats
        brands_data = data["data"]
        if isinstance(brands_data, dict):
            brands = brands_data.get("result", brands_data.get("items", []))
        elif isinstance(brands_data, list):
            brands = brands_data
        else:
            brands = []
        
        brand_ids = [b["id"] for b in brands if isinstance(b, dict)]
        assert created_brand["id"] in brand_ids
        print(f"Brand list contains {len(brands)} brands")
    
    def test_get_brand(self, business_auth, created_brand):
        """Test GET /api/v1/brand/{id}"""
        response = requests.get(
            f"{BASE_URL}/api/v1/brand/{created_brand['id']}",
            headers=business_auth
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["id"] == created_brand["id"]
        print(f"Brand retrieved: {data['data']['name']}")
    
    def test_update_brand(self, business_auth, created_brand):
        """Test PUT /api/v1/brand/{id}"""
        response = requests.put(
            f"{BASE_URL}/api/v1/brand/{created_brand['id']}",
            headers=business_auth,
            json={
                "website": "https://testbrand.com",
                "brand_colours": ["#FF5733", "#33FF57"]
            }
        )
        
        assert response.status_code == 200, f"Brand update failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        print("Brand updated successfully")
    
    def test_update_brand_bio(self, business_auth, created_brand):
        """Test PUT /api/v1/brand/{id}/brand-bio"""
        response = requests.put(
            f"{BASE_URL}/api/v1/brand/{created_brand['id']}/brand-bio",
            headers=business_auth,
            json={
                "description": "Test brand description",
                "visual_identity": "Modern and minimalist"
            }
        )
        
        assert response.status_code == 200, f"Brand bio update failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        print("Brand bio updated successfully")


class TestCampaigns:
    """Campaign CRUD tests"""
    
    @pytest.fixture(scope="class")
    def business_with_brand(self):
        """Create business user with a brand"""
        email = f"test_biz_camp_{TEST_ID}@test.com"
        password = "TestPass123!"
        
        # Register business
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/register/business",
            json={"email": email, "password": password}
        )
        data = response.json()
        auth = {"Authorization": f"Bearer {data['data']['access_token']}"}
        
        # Create brand
        brand_response = requests.post(
            f"{BASE_URL}/api/v1/brands",
            headers=auth,
            json={"name": f"Campaign Test Brand {TEST_ID}"}
        )
        brand_data = brand_response.json()
        
        return {
            "auth": auth,
            "brand_id": brand_data["data"]["id"]
        }
    
    @pytest.fixture(scope="class")
    def created_campaign(self, business_with_brand):
        """Create a campaign and return its data"""
        response = requests.post(
            f"{BASE_URL}/api/v1/brand/{business_with_brand['brand_id']}/campaigns",
            headers=business_with_brand["auth"],
            json={
                "name": f"Test Campaign {TEST_ID}",
                "start_date": "2026-02-01T00:00:00Z"
            }
        )
        
        assert response.status_code == 200, f"Campaign creation failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        return {
            **data["data"],
            "brand_id": business_with_brand["brand_id"],
            "auth": business_with_brand["auth"]
        }
    
    def test_create_campaign(self, created_campaign):
        """Verify campaign was created"""
        assert "id" in created_campaign
        assert created_campaign["name"] == f"Test Campaign {TEST_ID}"
        print(f"Campaign created: {created_campaign['name']} (ID: {created_campaign['id']})")
    
    def test_list_campaigns(self, created_campaign):
        """Test GET /api/v1/brand/{id}/campaigns"""
        response = requests.get(
            f"{BASE_URL}/api/v1/brand/{created_campaign['brand_id']}/campaigns",
            headers=created_campaign["auth"]
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        print(f"Campaign list retrieved")
    
    def test_get_campaign(self, created_campaign):
        """Test GET /api/v1/campaign/{id}"""
        response = requests.get(
            f"{BASE_URL}/api/v1/campaign/{created_campaign['id']}",
            headers=created_campaign["auth"]
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["id"] == created_campaign["id"]
        print(f"Campaign retrieved: {data['data']['name']}")
    
    def test_update_campaign_type(self, created_campaign):
        """Test PUT /api/v1/campaign/{id} with focus type"""
        response = requests.put(
            f"{BASE_URL}/api/v1/campaign/{created_campaign['id']}",
            headers=created_campaign["auth"],
            json={
                "focus": "increase_brand_awareness",
                "description": "Test campaign for brand awareness"
            }
        )
        
        assert response.status_code == 200, f"Campaign update failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        print("Campaign type updated successfully")
    
    def test_update_campaign_plan(self, created_campaign):
        """Test PUT /api/v1/campaign/{id}/plan"""
        response = requests.put(
            f"{BASE_URL}/api/v1/campaign/{created_campaign['id']}/plan",
            headers=created_campaign["auth"],
            json={
                "target_market": "Territory: Global\nMarket Size (Value): $2.5B",
                "target_customer": "Age: 25-34\nGender: All\nInterests: Technology",
                "competition_analysis": "Competitor 1: CompanyX\n  Positioning: Premium",
                "growth_target": "Expected Followers: 10,000\nExpected Likes: 50,000"
            }
        )
        
        assert response.status_code == 200, f"Campaign plan update failed: {response.text}"
        data = response.json()
        assert data["success"] is True
        print("Campaign plan updated successfully")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
