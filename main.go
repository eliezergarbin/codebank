package main

import (
	"database/sql"
	"fmt"
	"github.com/eliezergarbin/codebank/domain"
	"github.com/eliezergarbin/codebank/infrastructure/repository"
	"github.com/eliezergarbin/codebank/usecase"
	"log"
	_ "github.com/lib/pq"
)

func main() {
	db := setupDb()
	defer db.Close()
	producer := setupKafkaProducer()
	ProcessTransactionUseCase := setupTransactionUseCase(db, producer)
	serveGrpc(processTransactionUseCase)


}

func setupTransactionUseCase(db *sql.DB, producer kafka.KafkaProducer) usecase.UseCaseTransaction {
	transactionRepository := repository.NewTransactionRepositoryDb(db)
	useCase := usecase.NewUseCaseTransaction(transactionRepository)
	useCase.KafkaProducer = producer
	return useCase
}

func setupKafkaProducer() kafka.KafkaProducer {
	producer := kafka.NewKafkaProducer()
	producer.SetupProducer(os.Getenv("KafkaBootstrapServers"))
	return producer
}

func setupDb() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		"db",
		"5432",
		"postgres",
		"root",
		"codebank",
	)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("error connection to database")
	}
	return db
}

func serveGrpc(processTransactionUseCase usecase.UseCaseTransaction) {
	grpcServer := server.NewGRPCServer()
	grpcServer.ProcessTransactionUseCase = processTransactionUseCase
	grpcServer.Serve()
}

//cc := domain.NewCreditCard()
//cc.Number = "1234"
//cc.Name = "Eliezer"
//cc.ExpirationYear = 2021
//cc.ExpirationMonth = 7
//cc.CVV = 123
//cc.Limit = 1000
//cc.Balance = 0

//repo := repository.NewTransactionRepositoryDb(db)
//err := repo.CreateCreditCard(*cc)
//if err != nil {
//	fmt.Println(err)
//}