/* eslint-disable import/no-webpack-loader-syntax */
import ejsTemplateService from '!raw-loader!./cs-service.ejs';
import ejsTemplateInterface from '!raw-loader!./cs-service-interface.ejs';

const ejs = require('ejs');
const solc = require('solc-js');

class ContractCompiler {
  constructor(mainContract, otherContracts, preferredNamespace, generateAllInterfacesAndImplementations, combineContracts) {
    this.mainContract = mainContract;
    this.otherContracts = otherContracts;
    this.preferredNamespace = preferredNamespace || 'CustomNameSpace';
    this.generateAllInterfacesAndImplementations = generateAllInterfacesAndImplementations || true;
    this.combineContracts = combineContracts || true;

    this.combinedContractContent = '';
    this.generatedService = '';
    this.generatedInterface = '';
  }

  static async getVersions() {
    const select = await solc.versions();
    return select.releases;
  }

  async generate(compilerVersion) {
    console.log(`generate using compiler ${compilerVersion}`);

    const contractBaseFilename = this.mainContract.filename.replace('.sol', '');

    const sources = {};
    sources[contractBaseFilename] = { content: this.mainContract.content };

    const compiler = await solc(compilerVersion);
    console.log(`Compiling contracts with solc version '${compiler.version.name}'`);

    const output = await compiler(this.mainContract.content, this.solidityResolveImport);
    console.log(output);

    if (output.errors && output.errors.length > 0) {
      console.log(`Errors found:\r\n${JSON.stringify(output.errors, null, 4)}`);
    }

    if (this.generateAllInterfacesAndImplementations) {
      output.forEach((contract) => {
        this.generateFilesForContract(contract);
      });
    } else {
      this.generateFilesForContract(output[0]);
    }

    return {
      generatedService: this.generatedService,
      generatedInterface: this.generatedInterface,
    };
  }

  solidityResolveImport(contractFilename) {
    console.log(`Resolving contract '${contractFilename}'`);

    const contractContent = this.otherContracts[contractFilename];

    if (this.combineContracts) {
      this.combinedContractContent = `${this.combinedContractContent}${this.stripContractContent(contractContent)}`;
    }

    return { contents: contractContent };
  }

  generateContractService(contractName, ns, abi, bytecode) {
    const combinedInput = {
      _contractName: contractName,
      abi: JSON.parse(abi),
      bytecode,
      namespace: ns,
    };

    console.log(`${contractName}: generate C# interface(s)`);
    const templateInterface = ejs.compile(ejsTemplateInterface);
    this.generatedInterface = templateInterface(combinedInput);

    console.log(`${contractName}: generate C# implementation(s)`);
    const templateService = ejs.compile(ejsTemplateService);
    this.generatedService = templateService(combinedInput);
  }

  generateFilesForContract(contract) {
    const contractName = contract.name;
    const abi = JSON.stringify(contract.abi);
    const code = contract.binary.bytecodes.bytecode;

    console.log(`${contractName}: ABI=${abi}`);
    console.log(`${contractName}: ByteCode=${code}`);

    // replace *** by contractName (if present)
    const namespace = this.preferredNamespace.endsWith('***') ? this.preferredNamespace.replace('***', contractName) : this.preferredNamespace;

    this.generateContractService(contractName, namespace, abi, code);
  }

  static stripContractContent(contractContent, baseContractName) {
    const lines = contractContent.split('\r\n');

    for (let index = 0; index < lines.length; index += 1) {
      // Remove pragma solidity, except for baseContract
      if (lines[index].startsWith('pragma solidity')) {
        if (!baseContractName) {
          lines[index] = '';
        }
      }

      // Remove all import statements
      if (lines[index].startsWith('import')) {
        lines[index] = '';
      }

      // Comment all contract lines, except for baseContract
      if (lines[index].startsWith('contract')) {
        if (baseContractName) {
          lines[index] = `contract ${baseContractName} {`;
        } else {
          lines[index] = `// ${lines[index]}`;
        }
      }
    }

    lines[lines.length - 1] = '';

    return lines.join('\r\n');
  }
}

export default ContractCompiler;
