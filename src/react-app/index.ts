import { strings } from '@angular-devkit/core';
import { 
    Rule, 
    SchematicContext, 
    Tree, 
    url,
    mergeWith,
    move,
    template,
    apply,
    filter,
    forEach,
    noop,
    chain,
} from '@angular-devkit/schematics';
import { Schema } from './schema';


export function react(options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
      const subfolder = `./${options.name}`;
      if(options.subfolder)tree.create(`./${options.name}`,'');
      if(tree.exists('./package.json'))tree.delete('./package.json');
      const pathRegexp = /__.*__/;
      const fileSource = url('./files');
      const notComplierEJSList = [
        'src/index.ejs'
      ]
      const shouldBeComplier = (fp:string) => {
          if(pathRegexp.test(fp)) return true;
          if(fp.includes('.ejs')){
              return !notComplierEJSList.find(f=>fp.includes(f));
          }
          return false;
      }
      const parseTpl = apply(fileSource,[
        filter(shouldBeComplier),
        template({
          ...strings,
          ...options,
          jsExt: options.ts ? 'ts' : 'js',
          jsxExt: options.ts ? 'tsx' : 'jsx',
          ifModule: (styleSheet:string) => options.cssModule ? `module.${styleSheet}` : styleSheet
        }),
        forEach(fileEntry=>{
            try{
                const reg = /^\s*\n/gm;
                const content =  fileEntry.content.toString().replace(reg,"");
                tree.create(fileEntry.path.replace('.ejs',''),content);
                return null;
            }
            catch(e){
                console.log(e);
                return fileEntry;
            }
        })
      ]);
      const exIncludes = apply(fileSource,[
        filter(fp=>!fp.includes(".DS_Store") && !shouldBeComplier(fp))
      ]);
      return chain([
        mergeWith(parseTpl),
        mergeWith(exIncludes),
        options.useRedux ? noop() : filter(p=>!p.includes('src/models') && !p.includes('src/pages/demo')),
        options.ts ? noop() : filter(p=>!p.includes('tsconfig.json') && !p.includes('src/types')),
        !options.useRouter ? filter(p=>!p.includes('src/routes.') && !p.includes('src/pages/Base.')) : noop(),
        options.subfolder ? move(subfolder): noop(),
      ]);
  }
}
