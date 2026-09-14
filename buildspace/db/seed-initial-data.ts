import "dotenv/config";

import { sql } from "drizzle-orm";

import { db } from "./drizzle";
import { courses, lessons } from "./schema";

const seedCourses = [
    {
        title: "Fundamentos de Infraestrutura na AWS",
        description:
            "Aprenda a projetar e operar ambientes seguros, escaláveis e disponíveis na Amazon Web Services.",
        duration: 420,
        points: 700,
        lessons: [
            {
                title: "Regiões, zonas de disponibilidade e contas",
                content:
                    "Entenda a infraestrutura global da AWS e organize ambientes com contas, regiões e zonas de disponibilidade.",
                videoUrl: "https://www.youtube.com/watch?v=OFIVUTmc2cs",
            },
            {
                title: "Redes com Amazon VPC",
                content:
                    "Projete VPCs, sub-redes públicas e privadas, tabelas de rotas, gateways e grupos de segurança.",
                videoUrl: "https://www.youtube.com/watch?v=LJNNMTicv1c",
            },
            {
                title: "Computação e balanceamento de carga",
                content:
                    "Implemente cargas de trabalho com Amazon EC2, Auto Scaling e Elastic Load Balancing.",
                videoUrl: "https://www.youtube.com/watch?v=t48aVpw6kkI",
            },
            {
                title: "Armazenamento e bancos gerenciados",
                content:
                    "Escolha entre Amazon S3, EBS e RDS de acordo com os requisitos de persistência e disponibilidade.",
                videoUrl: "https://www.youtube.com/watch?v=77lMCiiMilo",
            },
            {
                title: "Segurança e observabilidade",
                content:
                    "Aplique controle de acesso com IAM e monitore recursos utilizando CloudWatch e CloudTrail.",
                videoUrl: "https://www.youtube.com/watch?v=cFMBm0997s8",
            },
        ],
    },
    {
        title: "Containers e Infraestrutura com Docker",
        description:
            "Aprenda a empacotar, executar e conectar aplicações em containers com Docker e Docker Compose.",
        duration: 180,
        points: 500,
        lessons: [
            {
                title: "Fundamentos de containers e Docker",
                content:
                    "Entenda o problema resolvido pelos containers e as diferenças entre imagens, containers e máquinas virtuais.",
                videoUrl:
                    "https://www.youtube.com/watch?v=IeyO3TnHcaw&t=887s",
            },
            {
                title: "Construindo imagens com Dockerfile",
                content:
                    "Crie um Dockerfile, escolha uma imagem base e compreenda as camadas e o cache de build.",
                videoUrl:
                    "https://www.youtube.com/watch?v=IeyO3TnHcaw&t=1300s",
            },
            {
                title: "Persistência, volumes e variáveis",
                content:
                    "Preserve dados dos containers e configure aplicações com volumes e variáveis de ambiente.",
                videoUrl:
                    "https://www.youtube.com/watch?v=IeyO3TnHcaw&t=3240s",
            },
            {
                title: "Imagens menores e containers seguros",
                content:
                    "Utilize builds em múltiplos estágios e execute processos sem privilégios de root.",
                videoUrl:
                    "https://www.youtube.com/watch?v=IeyO3TnHcaw&t=5220s",
            },
            {
                title: "Orquestração local com Docker Compose",
                content:
                    "Defina aplicações com múltiplos serviços, dependências e verificações de saúde usando Docker Compose.",
                videoUrl:
                    "https://www.youtube.com/watch?v=IeyO3TnHcaw&t=7143s",
            },
        ],
    },
    {
        title: "Orquestração de Containers com Kubernetes",
        description:
            "Implante e opere aplicações conteinerizadas com os principais recursos do Kubernetes.",
        duration: 360,
        points: 650,
        lessons: [
            {
                title: "Containers e arquitetura do Kubernetes",
                content:
                    "Conheça os componentes de um cluster e entenda como o Kubernetes coordena aplicações em containers.",
                videoUrl: "https://www.youtube.com/watch?v=ebIJrIMQTOk",
            },
            {
                title: "Pods e arquivos YAML",
                content:
                    "Descreva e execute workloads com Pods e manifestos declarativos em YAML.",
                videoUrl: "https://www.youtube.com/watch?v=UCs6JxkL1UM",
            },
            {
                title: "Deployments e escalabilidade",
                content:
                    "Gerencie réplicas, atualizações e disponibilidade de aplicações com Deployments.",
                videoUrl: "https://www.youtube.com/watch?v=thWniufHp8Q",
            },
            {
                title: "Services e exposição de aplicações",
                content:
                    "Exponha Pods de forma estável e conecte componentes usando Services e seletores.",
                videoUrl: "https://www.youtube.com/watch?v=uXP9KatdbBs",
            },
            {
                title: "Construindo um cluster do zero",
                content:
                    "Prepare nós e instale um cluster Kubernetes para consolidar os conceitos de infraestrutura.",
                videoUrl: "https://www.youtube.com/watch?v=TqMKBIinjew",
            },
        ],
    },
    {
        title: "Infraestrutura como Código e Arquitetura Multicloud",
        description:
            "Automatize infraestrutura e aplique padrões consistentes em ambientes AWS, Azure e Google Cloud.",
        duration: 480,
        points: 800,
        lessons: [
            {
                title: "Princípios de infraestrutura como código",
                content:
                    "Entenda estado declarativo, imutabilidade, repetibilidade e controle de versão da infraestrutura.",
                videoUrl: "https://www.youtube.com/watch?v=Aa3wadWjcKI",
            },
            {
                title: "Provisionamento com Terraform",
                content:
                    "Crie providers, recursos, variáveis, outputs e módulos reutilizáveis para diferentes provedores.",
                videoUrl: "https://www.youtube.com/watch?v=tE1WZg9ib8k",
            },
            {
                title: "Estado remoto e colaboração",
                content:
                    "Proteja o arquivo de estado, controle concorrência e organize ambientes de desenvolvimento e produção.",
                videoUrl: "https://www.youtube.com/watch?v=xFmUiidXfwY",
            },
            {
                title: "CI/CD para infraestrutura",
                content:
                    "Automatize validação, planejamento e aplicação de mudanças com pipelines seguros e auditáveis.",
                videoUrl: "https://www.youtube.com/watch?v=xFmUiidXfwY",
            },
            {
                title: "Governança, custos e resiliência multicloud",
                content:
                    "Defina padrões de segurança, tags, orçamento, recuperação de desastres e portabilidade entre nuvens.",
                videoUrl: "https://www.youtube.com/watch?v=A4vsZIX6UKs",
            },
        ],
    },
] as const;

async function seed() {
    if (!process.env.DATABASE_URL) {
        throw new Error("A variável de ambiente DATABASE_URL não foi definida.");
    }

    await db.transaction(async (tx) => {
        // Impede que duas execuções simultâneas criem registros duplicados.
        await tx.execute(sql`select pg_advisory_xact_lock(20260914)`);

        // A ordem evita violações de chave estrangeira. Registros de progresso e
        // matrículas relacionados também são removidos pelos cascades do schema.
        await tx.delete(lessons);
        await tx.delete(courses);

        for (const course of seedCourses) {
            const [createdCourse] = await tx
                .insert(courses)
                .values({
                    title: course.title,
                    description: course.description,
                    duration: course.duration,
                    points: course.points,
                })
                .returning({ id: courses.id });

            await tx.insert(lessons).values(
                course.lessons.map((lesson, index) => ({
                    title: lesson.title,
                    content: lesson.content,
                    videoUrl: lesson.videoUrl,
                    order: index + 1,
                    courseId: createdCourse.id,
                })),
            );
        }
    });

    console.log(
        `Seed concluído: ${seedCourses.length} curso(s) e ${seedCourses.reduce((total, course) => total + course.lessons.length, 0)} aula(s) adicionados.`,
    );
}

seed()
    .catch((error) => {
        console.error("Erro ao inserir os dados iniciais:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (db.$client) {
            await db.$client.end();
        }
    });
