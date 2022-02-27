from rest_framework.test import APITestCase
from django.urls import reverse_lazy

class OpenAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.schema_url = reverse_lazy('fetch-openapi-schema')

    def setUp(self):
        self.response = self.client.get(self.schema_url)

    def test_can_retrieve_openapi_specification(self):
        self.assertEqual(self.response.status_code, 200)

    def test_openapi_specification_has_correct_content_type(self):
        self.assertEqual(self.response.has_header('Content-Type'), True)
        self.assertEqual(self.response.headers['Content-Type'], 'application/vnd.oai.openapi')

    def test_openapi_specification_has_some_content(self):
        self.assertGreater(len(self.response.content), 0)
