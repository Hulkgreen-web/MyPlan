import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { Listr } from 'listr2';
import pc from 'picocolors';
import dotenv from 'dotenv';
import semver from 'semver';
import checkDiskSpace from 'check-disk-space';

// --- CONFIGURATION ---
const CONFIG = {
  envFile: '.env',
  envExample: '.env.example',
  minDiskSpaceGB: 1,
  services: [
    { name: 'PostgreSQL', host: '127.0.0.1', port: 5432 },
    { name: 'Redis', host: '127.0.0.1', port: 6379 },
  ],
};

// --- UTILS ---
const checkTcpConnection = (host, port, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error('Timeout'));
    }, timeout);

    socket.connect(port, host, () => {
      clearTimeout(timer);
      socket.end();
      resolve();
    });

    socket.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
};

// --- TASKS ---
const tasks = new Listr([
  {
    title: 'Vérification de la version de Node.js',
    task: async (ctx, task) => {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
      const requiredVersion = packageJson.engines?.node;

      if (!requiredVersion) {
        task.skip('Aucune contrainte "engines.node" trouvée dans package.json');
        return;
      }

      if (!semver.satisfies(process.version, requiredVersion)) {
        ctx.hadError = true;
        throw new Error(
          `Version Node.js incorrecte. Installée: ${pc.red(process.version)}, Requise: ${pc.green(requiredVersion)}`
        );
      }
      task.title = `Node.js version OK (${pc.cyan(process.version)})`;
    },
  },
  {
    title: 'Vérification des variables d\'environnement (.env)',
    task: async (ctx) => {
      if (!fs.existsSync(CONFIG.envExample)) {
        ctx.hadError = true;
        throw new Error(`${CONFIG.envExample} introuvable.`);
      }

      const exampleConfig = dotenv.parse(fs.readFileSync(CONFIG.envExample));
      const localConfig = fs.existsSync(CONFIG.envFile) 
        ? dotenv.parse(fs.readFileSync(CONFIG.envFile)) 
        : {};

      const missingKeys = Object.keys(exampleConfig).filter(key => !(key in localConfig));

      if (missingKeys.length > 0) {
        ctx.hadError = true;
        throw new Error(
          `Clés manquantes dans ${CONFIG.envFile} : ${pc.yellow(missingKeys.join(', '))}`
        );
      }
    },
  },
  {
    title: 'Vérification de l\'espace disque',
    task: async (ctx) => {
      const diskSpace = await checkDiskSpace(path.resolve('.'));
      const freeGB = diskSpace.free / 1024 / 1024 / 1024;

      if (freeGB < CONFIG.minDiskSpaceGB) {
        ctx.hadError = true;
        throw new Error(`Espace disque insuffisant : ${freeGB.toFixed(2)} Go restants (Min: ${CONFIG.minDiskSpaceGB} Go)`);
      }
    },
  },
  {
    title: 'Vérification de la disponibilité des services',
    task: (ctx, task) => {
      return task.newListr(
        CONFIG.services.map((svc) => ({
          title: `Vérification de ${svc.name} (${svc.host}:${svc.port})`,
          task: async () => {
            try {
              await checkTcpConnection(svc.host, svc.port);
            } catch (err) {
              ctx.hadError = true; // On marque l'erreur dans le contexte global
              throw new Error(`${svc.name} est inaccessible sur le port ${svc.port}.`);
            }
          },
        })),
        { concurrent: true, exitOnError: false }
      );
    },
  },
], {
  exitOnError: false,
  rendererOptions: { collapseSubtasks: false }
});

// --- EXECUTION ---
console.log(pc.bold(pc.blue('\n🚀 Lancement du diagnostic système...\n')));

try {
  const ctx = await tasks.run({ hadError: false });
  
  if (ctx.hadError) {
    console.error(pc.red(`\n${pc.bold('ERROR:')} Le diagnostic a détecté des problèmes. Veuillez les corriger avant de lancer l'application.\n`));
    process.exit(1);
  }

  console.log(pc.green(`\n${pc.bold('SUCCESS:')} L'environnement est prêt pour le développement ! ✨\n`));
} catch (e) {
  console.error(pc.red(`\n${pc.bold('FATAL ERROR:')} Une erreur critique est survenue.\n`));
  console.error(e);
  process.exit(1);
}
