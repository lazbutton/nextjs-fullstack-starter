# Configuration GitHub SSH sur Mac

Guide pour configurer votre Mac afin de pusher automatiquement vers GitHub sans mot de passe.

## ✅ Vérification rapide

Votre remote est déjà configuré en SSH (`git@github.com`), ce qui est parfait !

## Étape 1 : Vérifier votre clé SSH publique

Vous avez déjà des clés SSH. La clé recommandée est `id_ed25519.pub`.

## Étape 2 : Ajouter votre clé SSH à GitHub

1. **Copier votre clé publique** :
   ```bash
   pbcopy < ~/.ssh/id_ed25519.pub
   ```

2. **Ajouter à GitHub** :
   - Aller sur GitHub.com → **Settings** → **SSH and GPG keys**
   - Cliquer sur **"New SSH key"**
   - Donner un titre (ex: "Mac - MacBook Pro")
   - Coller la clé (Cmd+V)
   - Cliquer sur **"Add SSH key"**

## Étape 3 : Configurer l'agent SSH pour la session

L'agent SSH garde votre clé en mémoire pour la session courante :

```bash
# Démarrer l'agent SSH (s'il n'est pas déjà démarré)
eval "$(ssh-agent -s)"

# Ajouter votre clé privée
ssh-add ~/.ssh/id_ed25519
```

## Étape 4 : Configurer l'agent SSH au démarrage (automatique)

Pour que votre clé soit ajoutée automatiquement à chaque ouverture de terminal :

1. **Créer/modifier le fichier de configuration** :
   ```bash
   nano ~/.ssh/config
   ```

2. **Ajouter ces lignes** :
   ```
   Host github.com
     AddKeysToAgent yes
     UseKeychain yes
     IdentityFile ~/.ssh/id_ed25519
   ```

3. **Sauvegarder** : `Ctrl+X`, puis `Y`, puis `Enter`

4. **Ajouter la clé au trousseau macOS** :
   ```bash
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519
   ```

## Étape 5 : Tester la connexion

```bash
ssh -T git@github.com
```

Vous devriez voir :
```
Hi [votre-username]! You've successfully authenticated, but GitHub does not provide shell access.
```

## Étape 6 : Tester le push

```bash
git push origin main
```

Maintenant, le push devrait fonctionner sans demander de mot de passe !

## 🔧 Dépannage

### Si vous utilisez plusieurs clés SSH

Vous pouvez configurer différentes clés pour différents projets :

```bash
# Dans ~/.ssh/config
Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  AddKeysToAgent yes
  UseKeychain yes

Host github.com-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa
  AddKeysToAgent yes
  UseKeychain yes
```

Puis utiliser :
```bash
git remote set-url origin git@github.com-personal:votre-username/votre-repo.git
```

### Si la clé n'est pas ajoutée automatiquement

Ajouter dans `~/.zshrc` ou `~/.bash_profile` :

```bash
# Auto-start ssh-agent
if [ -z "$SSH_AUTH_SOCK" ]; then
   eval "$(ssh-agent -s)"
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519
fi
```

## 📝 Notes

- ✅ Avec SSH, vous n'aurez **jamais** besoin de votre mot de passe GitHub
- ✅ La clé privée reste sur votre Mac (ne jamais la partager)
- ✅ La clé publique peut être partagée (c'est normal)
- ✅ macOS Keychain stocke votre phrase secrète de façon sécurisée

## 🔒 Sécurité

- Ne partagez **jamais** votre clé privée (`id_ed25519` sans `.pub`)
- Si votre Mac est compromis, révoquez la clé sur GitHub immédiatement
- Utilisez des clés différentes pour différents comptes/projets si nécessaire

