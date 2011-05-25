var jsonWebSQL = function(){	
	var _createTable = function(json){
		var _buildCreateStatement = function(){
			var _createColDef = function(def){
				console.log(def.definition);
				return def.name + ' ' + def.definition + ' ' + def.restraint;
			};
			
			var _column_count = json.tbl_columns.length;
			var _tbl_columns = json.tbl_columns;
			
			var _create_sql = [];
				_create_sql.push('CREATE TABLE IF NOT EXISTS ' + json.tbl_name + ' (');
								
			for(i=0; i<_column_count; i++)
				_create_sql.push(_createColDef(_tbl_columns[i]) + ((i === _column_count - 1) ? '' : ','));			
			
			_create_sql.push(')'); // close create
			_create_sql = _create_sql.join('');
			
			return _create_sql;
		};
		
		var _db = _openDB(json);
		var _sql = _buildCreateStatement();
		
		_tx(_db, _sql);
	};
	
	var _tx = function(db, sql){
		db.transaction(function (tx) {
			tx.executeSql(sql);
		});				
	};
	
	var _openDB = function(json){
		var _db_version = json.db_version ? json.db_version : '1.0';
		var _db_desc = json.db_desc ? json.db_desc : ' ';
		var _db_size = json.db_size ? json.db_size : (2 * 1024 * 1024);	
			
		return openDatabase(json.db_name, _db_version, _db_desc, _db_size);
	}
		
	var _loadTable = function(json){
		var _rows = json.data;
		var _row_count = _rows.length;
		var _db_name = json.db_name;
		var _tbl = json.tbl_name;
		var _open = 'INSERT INTO ' + _tbl;
		var _insert_sql = [];
		
		for(i=0; i<_row_count; i++){
			var _columns = _rows[i];
			var _column_count = _columns.length;
			var _column_names = [];
			var _column_values = [];
			var _column_params = [];
			var _column_value;
			var _name;
						
			for(_name in _columns){
				_column_names.push(_name);
				_column_value = _columns[_name];
				_column_values.push(((isNaN(_column_value)) ? ('"' + _column_value + '"') : _column_value));			
			}
			
			_column_names = _column_names.join(',');
			_column_values = _column_values.join(',');			
			_insert_sql.push(_open + '(' + _column_names +') VALUES (' + _column_values + ')');			
		}
		
		var _db = _openDB(json);
		
		if(_db){
			_db.transaction(function(tx){
				var _insert_count = _insert_sql.length;
				
				for(i=0; i<_insert_count; i++)
					tx.executeSql(_insert_sql[i]);				
			});	
		}	
	};			
	
	return {
		create : function(json){
			_createTable(json);
		},
		load : function(json){
			_loadTable(json);			
		}				
	}		
}();
