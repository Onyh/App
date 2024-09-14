const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem-vindo ao Apps de Metas";


let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,

}

let metas = [meta]

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:"})

    if(meta.length == 0) {
        mensagem = 'A meta não pode ser vazia.'
        return 
    }    

    metas.push(
        { value: meta, checked: false}
    )

    mensagem = "Meta cadastrada com sucesso!"

}

const listarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }
    const respostas = await checkbox({
        message: "Use as cetas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    respostas.forEach((resposta) => {
       const meta = metas.find((m) => {
            return m.value == resposta 
       }) 

       meta.checked = true
    })

    mensagem = 'Meta(s) marcada(s) como concluída(s)'

}

const metasRealizadas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "Não existem metas realizadas!"
        return
    }

    await select({
        message: "Metas finalizadas: " + realizadas.length,
        choices: [...realizadas]
    })

}

const metasAbertas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const abertas = metas.filter((meta) => {
        return !meta.checked // ou != true 
    })
// o motivo da primeira função não ter parado no primeiro "return" acontece por serem de funções diferentes
// o primeiro "return" é da função "const abertas = metas.filter((meta)"
// e o segundo é da "const metasAbertas = async ()" 
// ou seja, é como se o primeiro "return" estivesse oculto para a primeria função

    if(abertas.length == 0) {
        mensagem = "Não existem metas abertas! :) "
        return
    }
// "Ah, mas como a primeira função está enxergando o segundo return?"
// Eu também não entendi essa parte, já que esse "return" está dentro de uma terceira função 
// O professor não explicou direito :|

    await select({
        message: "Notas Abertas: " + abertas.length,
        choices: [...abertas]
    })
// Colocar(Concatenar +) o "abertas.length" faz com que mostre a quantidade total de "Metas Abertas"
    // Eu errei o símbolo de concatenação ;(
// Isso também acontece nas funções anteriores
// É que comecei fazer essas anotações agora :P 
}

const deletarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }
    
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })
    const itensADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itensADeletar.length == 0){
        mensagem = "Nenhum item para deletar!"
        return
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!"

}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

// Esse é o "Menu"
// Simples ou minimalista?  
const start = async () => {
    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()
        
        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        }) 
       
        switch(opcao){
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case"realizadas":
                await metasRealizadas()
                break
            case"abertas":
                await metasAbertas()
                break
            case"deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("Até a próxima!")
                return
        }
// É importante colocar os itens do menu (ou função) para depois aplicá-las

    }
}

start()