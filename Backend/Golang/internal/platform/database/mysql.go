package database

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

func OpenMySQL(dsn string) (*sql.DB, error) { return sql.Open("mysql", dsn) }
