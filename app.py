from flask import Flask, render_template, request, jsonify
from models import db, Business
from sqlalchemy import or_

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///businesses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Criar tabelas ao iniciar
with app.app_context():
    db.create_all()
    # Adicionar coluna observations se não existir (para bancos existentes)
    try:
        from sqlalchemy import inspect, text
        inspector = inspect(db.engine)
        columns = [col['name'] for col in inspector.get_columns('business')]
        if 'observations' not in columns:
            with db.engine.begin() as conn:
                conn.execute(text('ALTER TABLE business ADD COLUMN observations TEXT'))
    except Exception as e:
        # Se der erro, ignora (pode ser que a tabela não exista ainda ou já tenha a coluna)
        pass


@app.route('/')
def index():
    """Página inicial do sistema"""
    return render_template('home.html')


@app.route('/empresas')
def empresas():
    """Página de listagem de empresas com paginação"""
    try:
        page = request.args.get('page', 1, type=int)
        if page < 1:
            page = 1
        per_page = 10
        
        businesses = Business.query.order_by(Business.id.asc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return render_template('empresas.html', 
                             businesses=businesses.items,
                             pagination=businesses,
                             current_page=page)
    except Exception as e:
        # Em caso de erro, retorna página vazia
        return render_template('empresas.html', 
                             businesses=[],
                             pagination=None,
                             current_page=1)


@app.route('/empresa/<int:business_id>')
def empresa_detail(business_id):
    """Página de detalhes de uma empresa"""
    business = Business.query.get_or_404(business_id)
    return render_template('empresa_detail.html', business=business)


@app.route('/cadastrar')
def cadastrar():
    """Página de cadastro de nova empresa"""
    return render_template('cadastrar.html')


@app.route('/api/businesses', methods=['GET'])
def get_businesses():
    """API: Lista negócios com paginação"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    query = Business.query.order_by(Business.id.asc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'businesses': [{
            'id': b.id,
            'name': b.name,
            'email': b.email,
            'phone': b.phone,
            'observations': b.observations or ''
        } for b in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev
    })


@app.route('/api/businesses', methods=['POST'])
def create_business():
    """Cria um novo negócio"""
    data = request.get_json()
    
    # Validações
    if not data.get('name') or not data.get('name').strip():
        return jsonify({'error': 'Nome é obrigatório'}), 400
    
    if not data.get('email') or not data.get('email').strip():
        return jsonify({'error': 'Email é obrigatório'}), 400
    
    # Validação básica de email
    email = data.get('email').strip()
    if '@' not in email or '.' not in email.split('@')[1]:
        return jsonify({'error': 'Email inválido'}), 400
    
    if not data.get('phone') or not data.get('phone').strip():
        return jsonify({'error': 'Telefone é obrigatório'}), 400
    
    # Verificar se email já existe
    if Business.query.filter_by(email=email).first():
        return jsonify({'error': 'Email já cadastrado'}), 400
    
    business = Business(
        name=data.get('name').strip(),
        email=email,
        phone=data.get('phone').strip(),
        observations=data.get('observations', '').strip() if data.get('observations') else None
    )
    
    db.session.add(business)
    db.session.commit()
    
    return jsonify({
        'id': business.id,
        'name': business.name,
        'email': business.email,
        'phone': business.phone,
        'observations': business.observations or ''
    }), 201


@app.route('/api/businesses/<int:business_id>', methods=['PUT'])
def update_business(business_id):
    """Atualiza um negócio existente"""
    business = Business.query.get_or_404(business_id)
    data = request.get_json()
    
    # Validações
    if not data.get('name') or not data.get('name').strip():
        return jsonify({'error': 'Nome é obrigatório'}), 400
    
    if not data.get('email') or not data.get('email').strip():
        return jsonify({'error': 'Email é obrigatório'}), 400
    
    # Validação básica de email
    email = data.get('email').strip()
    if '@' not in email or '.' not in email.split('@')[1]:
        return jsonify({'error': 'Email inválido'}), 400
    
    if not data.get('phone') or not data.get('phone').strip():
        return jsonify({'error': 'Telefone é obrigatório'}), 400
    
    # Verificar se email já existe em outro registro
    existing = Business.query.filter_by(email=email).first()
    if existing and existing.id != business_id:
        return jsonify({'error': 'Email já cadastrado'}), 400
    
    business.name = data.get('name').strip()
    business.email = email
    business.phone = data.get('phone').strip()
    business.observations = data.get('observations', '').strip() if data.get('observations') else None
    
    db.session.commit()
    
    return jsonify({
        'id': business.id,
        'name': business.name,
        'email': business.email,
        'phone': business.phone,
        'observations': business.observations or ''
    })


@app.route('/api/businesses/<int:business_id>', methods=['DELETE'])
def delete_business(business_id):
    """Exclui um negócio"""
    business = Business.query.get_or_404(business_id)
    db.session.delete(business)
    db.session.commit()
    
    return jsonify({'message': 'Negócio excluído com sucesso'}), 200


if __name__ == '__main__':
    app.run(debug=True)
