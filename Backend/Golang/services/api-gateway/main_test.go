package main

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestHashKeyDeterministic(t *testing.T) {
	a := hashKey("01234567890123456789012345678901", "gak_live_secret")
	assert.Len(t, a, 64)
	assert.Equal(t, a, hashKey("01234567890123456789012345678901", "gak_live_secret"))
	assert.NotEqual(t, a, hashKey("different-pepper-012345678901234567", "gak_live_secret"))
}
func TestScopesAndIP(t *testing.T) {
	assert.True(t, hasScope([]string{"game:*"}, "game:read"))
	assert.False(t, hasScope([]string{"game:read"}, "game:create"))
	assert.True(t, allowedIP("10.0.0.8", []string{"10.0.0.0/24"}))
	assert.False(t, allowedIP("10.0.1.8", []string{"10.0.0.0/24"}))
}
func TestLongestRoute(t *testing.T) {
	r, ok := matchRoute([]route{{Prefix: "/api/v1/games/media"}, {Prefix: "/api/v1/games"}}, "/api/v1/games/media/1")
	assert.True(t, ok)
	assert.Equal(t, "/api/v1/games/media", r.Prefix)
}
func TestMethodSpecificScope(t *testing.T) {
	r := route{Scope: "fallback", ReadScope: "game:read", WriteScope: "game:create"}
	assert.Equal(t, "game:read", scopeFor(r, "GET"))
	assert.Equal(t, "game:create", scopeFor(r, "POST"))
}
