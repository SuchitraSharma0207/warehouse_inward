import psycopg2

def get_db_connection():
    conn=psycopg2.connect(
        host="localhost",
        database="warehouse",
        user="postgres",
        password="Sweetu@123"

    )
    return conn