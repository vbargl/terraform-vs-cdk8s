#!/bin/env bash

NOW="$(date +%Y-%m-%d-%H-%M-%S)"
cd "$(dirname $0)/"

echo "Installing k0s"
k0sctl apply


[[ -f "$HOME/.kube/config" ]] && [[ ! -L "$HOME/.kube/config" ]] && {
  echo "Backing up existing ~/.kube/config"
  mv $HOME/.kube/config "$HOME/.kube/config.bak-$NOW"
}

KUBECFG="$(realpath ./kubeconfig)"

[[ -f "$KUBECFG" ]] && {
  echo "Backing up existing ./kubeconfig"
  mkdir -p kubeconfig.old
  mv "$KUBECFG" "kubeconfig.old/kubeconfig-$NOW"
}

echo "Saving kubeconfig for newly installed k0s"
k0sctl kubeconfig > "$KUBECFG"
ln -fs "$KUBECFG" ~/.kube/config