#!/bin/sh

# Função para verificar se um comando existe
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

# Workaround para Windows 10, Git Bash e Yarn
# Verifica se o comando winpty existe e se a saída está associada a um terminal (tela)
if command_exists winpty && test -t 1; then
  exec < /dev/tty
fi
