from beanie import Document


class ResumeToken(Document):
    token: str
    application_id: str
