package validation

import (
	"github.com/stretchr/testify/require"
	"testing"
)

func TestNew(t *testing.T) { require.NotNil(t, New()) }
