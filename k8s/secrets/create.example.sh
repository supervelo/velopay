# Copyright 2021 - 2023 Transflox LLC. All rights reserved.

hash() {
  echo $(echo "$1" | tr -d '\n' | base64)
}

export ENV=$(hash production)
export NAMESPACE_RAW=production

export PRODUCTION=$(hash true)

export OPENAI_API_KEY=$(hash "")
export TENSOR_API_KEY=$(hash "")


# gen
envsubst < ./secrets.template.yml > gen.secrets-${NAMESPACE_RAW}.yml
