package cache

import "github.com/redis/go-redis/v9"

func NewRedis(address string) *redis.Client { return redis.NewClient(&redis.Options{Addr: address}) }
