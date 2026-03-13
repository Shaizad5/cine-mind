#!/usr/bin/env python3
import requests
import sys
import time
import json
from datetime import datetime

class MovieRecommenderAPITester:
    def __init__(self, base_url="https://e1d8e5ed-e92e-4d49-bfe2-a64c760c8a0f.preview.emergentagent.com"):
        self.base_url = base_url
        self.session_id = f"test_session_{datetime.now().strftime('%H%M%S')}"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = {}

    def log_result(self, test_name, passed, response_data=None, error_msg=None):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
            print(f"✅ {test_name} - PASSED")
        else:
            print(f"❌ {test_name} - FAILED: {error_msg}")
        
        self.test_results[test_name] = {
            "passed": passed,
            "response": response_data,
            "error": error_msg
        }

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=10):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        print(f"\n🔍 Testing {name} - {method} {endpoint}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            
            success = response.status_code == expected_status
            if success:
                response_data = response.json() if response.text else {}
                self.log_result(name, True, response_data)
                return True, response_data
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}. Response: {response.text[:200]}"
                self.log_result(name, False, error_msg=error_msg)
                return False, {}

        except requests.exceptions.Timeout:
            self.log_result(name, False, error_msg=f"Request timeout after {timeout}s")
            return False, {}
        except Exception as e:
            self.log_result(name, False, error_msg=str(e))
            return False, {}

    def test_health(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_home_categories(self):
        """Test different home categories"""
        categories = ['trending', 'popular', 'top_rated', 'now_playing', 'upcoming']
        all_passed = True
        
        for category in categories:
            success, data = self.run_test(
                f"Home - {category.title()}",
                "GET", 
                f"home?category={category}&limit=5",
                200
            )
            if success:
                # Verify response structure
                if not isinstance(data.get('results'), list):
                    self.log_result(f"Home {category} - Structure", False, error_msg="Results not a list")
                    all_passed = False
                elif len(data['results']) == 0:
                    self.log_result(f"Home {category} - Data", False, error_msg="No results returned")
                    all_passed = False
                else:
                    self.log_result(f"Home {category} - Structure", True, {"count": len(data['results'])})
            else:
                all_passed = False
                
        return all_passed

    def test_search(self):
        """Test search functionality"""
        test_queries = [
            ("inception", "Popular movie search"),
            ("avengers", "Multiple results search"),
            ("xyz123nonexistent", "No results search")
        ]
        
        all_passed = True
        for query, description in test_queries:
            success, data = self.run_test(
                f"Search - {description}",
                "GET",
                f"search?query={query}",
                200
            )
            if success:
                if 'results' not in data:
                    self.log_result(f"Search {query} - Structure", False, error_msg="Missing results field")
                    all_passed = False
                else:
                    self.log_result(f"Search {query} - Structure", True, {
                        "count": len(data['results']), 
                        "total": data.get('total_results', 0)
                    })
            else:
                all_passed = False
                
        return all_passed

    def test_movie_details(self):
        """Test movie details endpoint"""
        # Test with a known movie ID (Inception)
        movie_id = 27205
        success, data = self.run_test(
            "Movie Details",
            "GET",
            f"movie/{movie_id}",
            200,
            timeout=15
        )
        
        if success:
            required_fields = ['tmdb_id', 'title', 'overview']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                self.log_result("Movie Details - Structure", False, error_msg=f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_result("Movie Details - Structure", True, {"title": data.get('title')})
                return True
        return False

    def test_ratings(self):
        """Test ratings functionality"""
        movie_id = 27205  # Inception
        
        # Test POST rating
        rating_data = {
            "tmdb_id": movie_id,
            "session_id": self.session_id,
            "rating": 4.5,
            "movie_title": "Inception"
        }
        
        success, response = self.run_test(
            "Submit Rating",
            "POST",
            "ratings",
            200,
            data=rating_data
        )
        
        if not success:
            return False
            
        # Test GET rating
        success, data = self.run_test(
            "Get Rating",
            "GET",
            f"ratings/{movie_id}?session_id={self.session_id}",
            200
        )
        
        if success:
            if data.get('user_rating') == 4.5:
                self.log_result("Rating Persistence", True, {"user_rating": data.get('user_rating')})
                return True
            else:
                self.log_result("Rating Persistence", False, error_msg=f"Expected 4.5, got {data.get('user_rating')}")
                return False
        return False

    def test_reviews(self):
        """Test reviews functionality"""
        movie_id = 27205  # Inception
        
        # Test POST review
        review_data = {
            "tmdb_id": movie_id,
            "session_id": self.session_id,
            "author_name": "Test User",
            "content": "This is a test review for the movie recommender system.",
            "rating": 4.0
        }
        
        success, response = self.run_test(
            "Submit Review",
            "POST",
            "reviews",
            200,
            data=review_data
        )
        
        if not success:
            return False
            
        # Test GET reviews
        success, data = self.run_test(
            "Get Reviews",
            "GET",
            f"reviews/{movie_id}",
            200
        )
        
        if success:
            if isinstance(data.get('reviews'), list):
                self.log_result("Reviews Structure", True, {"count": len(data['reviews'])})
                return True
            else:
                self.log_result("Reviews Structure", False, error_msg="Reviews not a list")
                return False
        return False

    def test_recommendations(self):
        """Test recommendation endpoints"""
        movie_id = 27205  # Inception
        movie_title = "Inception"
        
        # Test TF-IDF recommendations
        success, data = self.run_test(
            "TF-IDF Recommendations",
            "GET",
            f"recommend/tfidf?title={movie_title}&top_n=5",
            200,
            timeout=15
        )
        
        tfidf_passed = success and isinstance(data, list)
        if tfidf_passed:
            self.log_result("TF-IDF Structure", True, {"count": len(data)})
        else:
            self.log_result("TF-IDF Structure", False, error_msg="Response not a list")
        
        # Test Genre recommendations
        success, data = self.run_test(
            "Genre Recommendations",
            "GET",
            f"recommend/genre?tmdb_id={movie_id}&limit=5",
            200,
            timeout=15
        )
        
        genre_passed = success and isinstance(data, list)
        if genre_passed:
            self.log_result("Genre Recommendations Structure", True, {"count": len(data)})
        else:
            self.log_result("Genre Recommendations Structure", False, error_msg="Response not a list")
        
        # Test Collaborative recommendations
        success, data = self.run_test(
            "Collaborative Recommendations",
            "GET",
            f"recommend/collaborative?tmdb_id={movie_id}&session_id={self.session_id}&limit=5",
            200,
            timeout=15
        )
        
        collab_passed = success and isinstance(data, list)
        if collab_passed:
            self.log_result("Collaborative Recommendations Structure", True, {"count": len(data)})
        else:
            self.log_result("Collaborative Recommendations Structure", False, error_msg="Response not a list")
            
        return tfidf_passed and genre_passed and collab_passed

    def test_mood_match(self):
        """Test AI Mood Matcher"""
        mood_data = {
            "mood": "I want something uplifting and feel-good",
            "session_id": self.session_id
        }
        
        success, data = self.run_test(
            "Mood Match",
            "POST",
            "mood-match",
            200,
            data=mood_data,
            timeout=30  # AI requests can take longer
        )
        
        if success:
            if 'recommendations' in data and isinstance(data['recommendations'], list):
                self.log_result("Mood Match Structure", True, {"count": len(data['recommendations'])})
                # Give it some time to process
                time.sleep(2)
                return True
            else:
                self.log_result("Mood Match Structure", False, error_msg="Missing or invalid recommendations")
                return False
        return False

    def test_stats(self):
        """Test stats endpoint"""
        success, data = self.run_test(
            "Statistics",
            "GET",
            "stats",
            200
        )
        
        if success:
            required_fields = ['total_ratings', 'total_reviews', 'unique_users']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                self.log_result("Stats Structure", False, error_msg=f"Missing fields: {missing_fields}")
                return False
            else:
                self.log_result("Stats Structure", True, data)
                return True
        return False

    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting Movie Recommender API Tests")
        print(f"📡 Base URL: {self.base_url}")
        print(f"👤 Session ID: {self.session_id}")
        print("=" * 60)
        
        # Run tests in logical order
        tests = [
            ("Health Check", self.test_health),
            ("Home Categories", self.test_home_categories),
            ("Search Functionality", self.test_search),
            ("Movie Details", self.test_movie_details),
            ("Ratings System", self.test_ratings),
            ("Reviews System", self.test_reviews),
            ("Recommendation Engines", self.test_recommendations),
            ("AI Mood Matcher", self.test_mood_match),
            ("Statistics", self.test_stats),
        ]
        
        for test_name, test_func in tests:
            print(f"\n{'='*20} {test_name} {'='*20}")
            try:
                test_func()
            except Exception as e:
                print(f"❌ {test_name} - EXCEPTION: {str(e)}")
                self.log_result(f"{test_name} - Exception", False, error_msg=str(e))
        
        # Print summary
        print(f"\n{'='*60}")
        print(f"📊 SUMMARY: {self.tests_passed}/{self.tests_run} tests passed")
        print(f"✅ Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        # Identify critical failures
        critical_failures = []
        for test_name, result in self.test_results.items():
            if not result['passed'] and any(critical in test_name.lower() for critical in ['health', 'home', 'search', 'movie details']):
                critical_failures.append(test_name)
        
        if critical_failures:
            print(f"🚨 CRITICAL FAILURES: {', '.join(critical_failures)}")
            
        return self.tests_passed == self.tests_run

def main():
    """Main function"""
    tester = MovieRecommenderAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())