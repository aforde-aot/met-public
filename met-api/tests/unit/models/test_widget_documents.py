# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Tests for the Org model.

Test suite to ensure that the Engagement model routines are working as expected.
"""

from faker import Faker

from met_api.models import WidgetDocuments as WidgetDocumentsModel
from tests.utilities.factory_scenarios import TestWidgetDocumentInfo, TestWidgetInfo
from tests.utilities.factory_utils import factory_engagement_model, factory_widget_model


fake = Faker()


def test_document(session):
    """Assert that an widget document can be created and fetched."""
    widget = _create_widget()
    document = WidgetDocumentsModel(
        **TestWidgetDocumentInfo.document1
    )
    document.widget_id = widget.id
    session.add(document)
    session.commit()
    assert document.id is not None
    assert document.title == TestWidgetDocumentInfo.document1.get('title')


def test_get_all_by_widget_id(session):
    """Assert that all widget document can be fetched."""
    widget = _create_widget()
    document1 = WidgetDocumentsModel(
        **TestWidgetDocumentInfo.document1
    )
    document2 = WidgetDocumentsModel(
        **TestWidgetDocumentInfo.document2
    )
    document1.widget_id = widget.id
    document2.widget_id = widget.id
    session.add(document1)
    session.add(document2)
    session.commit()

    expected_docs = WidgetDocumentsModel.get_all_by_widget_id(widget.id)
    assert len(expected_docs) == 2


def _create_widget():
    engagement = factory_engagement_model()
    TestWidgetInfo.widget2['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget2)
    return widget