import * as recast from 'recast';

type VariableDeclaration = recast.types.namedTypes.VariableDeclaration;

/**
 * Webpack loader to strip functions from the source code
 * Strips the `getComponentServerProps` function from the source code
 * @param {string} source file source code
 * @returns {string} output file source code with stripped functions
 */
export default function componentPropsLoader(source: string) {
  // Parse the source code into an AST (Abstract Syntax Tree)
  const ast = recast.parse(source, {
    parser: require('recast/parsers/babel-ts'),
  });

  // The method to strip from the AST
  const method = 'getComponentServerProps';

  // Traverse the AST and find the method to strip
  recast.visit(ast, {
    // Visit the named export function expression
    visitExportNamedDeclaration: function (path): boolean | void {
      // Get the variable declaration from the AST
      const isMethodFound = (path.node.declaration as VariableDeclaration)?.declarations?.find(
        (declaration) => {
          // Check if the function is the one we want to strip
          if (
            'id' in declaration &&
            'name' in declaration.id &&
            typeof declaration.id.name === 'string' &&
            declaration.id.name === method
          ) {
            // Strip the function from the AST
            path.prune();

            // We have pruned the method, so we can stop iterating over the declarations
            return true;
          }

          return false;
        }
      );

      if (isMethodFound) {
        // We have pruned the method, so we can stop traversing the AST
        return false;
      }

      // Continue traversing the AST
      this.traverse(path);
    },
    // Visit the named export function declaration
    visitFunctionDeclaration: function (path): boolean | void {
      // Check if the function is the one we want to strip
      if (
        path.node.id &&
        'name' in path.node.id &&
        typeof path.node.id.name === 'string' &&
        path.node.id.name === method
      ) {
        // Strip the function from the AST
        path.prune();

        // We have pruned the method, so we can stop traversing the AST
        return false;
      }

      // Continue traversing the AST
      this.traverse(path);
    },
  });

  // Generate the output code
  return recast.print(ast).code;
}
