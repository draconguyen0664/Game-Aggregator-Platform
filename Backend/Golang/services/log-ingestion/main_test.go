package main

import (
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestMaskMapRecursive(t *testing.T) {
	m := map[string]any{"password": "secret", "nested": map[string]any{"accessToken": "abc", "safe": "value"}}
	got := maskMap(m)
	assert.Equal(t, "***REDACTED***", got["password"])
	nested := got["nested"].(map[string]any)
	assert.Equal(t, "***REDACTED***", nested["accessToken"])
	assert.Equal(t, "value", nested["safe"])
}
func TestValidate(t *testing.T) {
	assert.NoError(t, validate(logEvent{EventID: "1", Timestamp: time.Now(), Level: "INFO", Service: "game", Message: "ok"}))
	assert.Error(t, validate(logEvent{EventID: "1", Timestamp: time.Now(), Level: "INVALID", Service: "game", Message: "bad"}))
}
