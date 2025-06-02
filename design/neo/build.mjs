import { transformTokens } from './transform.mjs';
import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensBasePath = __dirname;
const buildPath = 'src/tokens/';
function getTokenSets() {
  const metadataPath = path.resolve(tokensBasePath, 'tokens/multi/$metadata.json');
  return JSON.parse(fs.readFileSync(metadataPath, 'utf-8')).tokenSetOrder;
}
function registerTransforms() {
  register(StyleDictionary, {
    excludeParentKeys: false,
    platform: "css",
    'ts/color/modifiers': { format: 'hex' }
  });
  StyleDictionary.registerTransform({
    type: 'name',
    transitive: true,
    name: 'name/kebab-no-default',
    transform: (token, config) => {
      const transformedName = token.path
        .map(part => part.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
          .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase())
        .join('-')
        .replace(/-default$/, '');
      return config.prefix ? `${config.prefix}--${transformedName}` : transformedName;
    }
  });
}
async function build() {
  try {
    await transformTokens();
    registerTransforms();
    const promises = [
      global(),
      semantic(),
      mode(),
    ];
    await Promise.all(promises);
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}
async function semantic() {
  const sets = getTokenSets().filter(set => set.startsWith("semantic/"));
  const promises = sets.map(set => {
    const sd = new StyleDictionary({
      source: [`${tokensBasePath}/tokens/multi/global/*.json`, `${tokensBasePath}/tokens/multi/semantic/*.json`, `${tokensBasePath}/tokens/multi/mode/light.json`],
      preprocessors: ['tokens-studio'],
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          transforms: ['attribute/cti', 'name/kebab-no-default', 'fontFamily/css'],
          buildPath,
          files: [{
            destination: `neo/${set}.css`,
            format: 'css/variables',
            options: {
              outputReferences: true
            },
            filter: token => token.filePath.endsWith(`${set}.json`)
          }]
        }
      },
      log: { verbosity: 'verbose' }
    });
    return sd.buildPlatform('css');
  });
  return Promise.all(promises);
}
async function global() {
  const sets = getTokenSets().filter(set => set.startsWith("global/"));
  const promises = sets.map(set => {
    const sd = new StyleDictionary({
      source: [`${tokensBasePath}/tokens/multi/global/*.json`, `${tokensBasePath}/tokens/multi/semantic/*.json`, `${tokensBasePath}/tokens/multi/mode/light.json`],
      preprocessors: ['tokens-studio'],
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          transforms: ['attribute/cti', 'name/kebab-no-default', 'fontFamily/css'],
          buildPath,
          files: [{
            destination: `${set}.css`,
            format: 'css/variables',
            options: {
              outputReferences: true
            },
            filter: token => token.filePath.endsWith(`${set}.json`)
          }]
        }
      },
      log: { verbosity: 'verbose' }
    });
    return sd.buildPlatform('css');
  });
  return Promise.all(promises);
}
async function mode() {
  const modes = ["light", "dark"];
  const promises =
  modes.map(mode => {
      const sd = new StyleDictionary({
        source: [`${tokensBasePath}/tokens/multi/global/*.json`, `${tokensBasePath}/tokens/multi/semantic/*.json`, `${tokensBasePath}/tokens/multi/mode/${mode}.json`],
        preprocessors: ['tokens-studio'],
        platforms: {
          css: {
            transformGroup: 'tokens-studio',
            transforms: ['attribute/cti', 'name/kebab-no-default', 'fontFamily/css'],
            buildPath,
            files: [{
              destination: `neo/mode/${mode}.css`,
              format: 'css/variables',
              options: {
                selector: `[data-mode=${mode}]`,
                outputReferences: true
              },
              filter: token => token.filePath.endsWith(`${mode}.json`)
            }]
          }
        },
        log: { verbosity: 'verbose' }
      });
      return sd.buildPlatform('css');
    });
  return Promise.all(promises);
}
build();