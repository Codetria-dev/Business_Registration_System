from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Business(db.Model):
    """Modelo para representar um negócio cadastrado"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    observations = db.Column(db.Text, nullable=True)
    
    def __repr__(self):
        return f'<Business {self.name}>'
