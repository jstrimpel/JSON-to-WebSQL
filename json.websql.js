var jsonWebSQL = function(){	
	var _createTable = function(json){
		var _buildCreateStatement = function(){
			var _createColDef = function(def){
				return def.name + ' ' + def.definition + ' ' + def.restraint;
			};
			
			var _column_count = json.tbl_columns;
			
			var _create_sql = [];
				_create_sql.push('CREATE TABLE IF NOT EXISTS ' + json.tbl_name + ' (');
								
			for(i=0; i<_column_count; i++)
				_create_sql.push(_createColDef(tbl_columns[i]) + ((i === _column_count - 1) ? ',' : ''));			
			
			_create_sql.push(')'); // close create
			_create_sql = _create_sql.join('');
			
			return _create_sql;
		};
		
		var _db = _createDB(json);
		var _sql = _buildCreateStatement();
		
		_tx(_sql);
	};
	
	var _tx = function(db, sql){
		db.transaction(function (tx) {
			tx.executeSql(sql);
		});				
	};
	
	var _createDB = function(json){
		var _db_version = json.db_version ? json.db_version : '1.0';
		var _db_desc = json.db_desc ? json.db_desc : ' ';
		var _db_size = json.db_size ? json.db_size : (2 * 1024 * 1024);	
				
		return openDatabase(json.db_name, json.db_version, _db_desc, _db_size);
	}
	
	
	
	
	
	return {
		create : function(json){
			_createTable(json);
		},
		insert : function(){
			
			
		}				
	}		
}();
