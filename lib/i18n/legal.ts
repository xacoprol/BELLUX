import { company } from "@/lib/company";
import type { Locale } from "@/lib/i18n/types";

export type LegalDocId = "aviso-legal" | "privacidade" | "cookies";

export type LegalTable = {
  headers: string[];
  rows: string[][];
  note?: string;
};

export type LegalSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
  table?: LegalTable;
};

export type LegalDoc = {
  id: LegalDocId;
  path: `/${LegalDocId}`;
  title: string;
  description: string;
  updatedLabel: string;
  sections: LegalSection[];
};

const address = `${company.fullAddress}, ${company.country}`;
const identity = `${company.legalName} (NIF ${company.nif}), marca comercial ${company.brand}`;

const updated = {
  pt: "Última atualização: julho de 2026",
  es: "Última actualización: julio de 2026",
  en: "Last updated: July 2026",
} as const;

const cookieTablePt: LegalTable = {
  headers: [
    "Nome",
    "Fornecedor",
    "Finalidade",
    "Tipo",
    "Duração",
    "Categoria",
  ],
  rows: [
    [
      "bellux-cookie-consent",
      company.legalName,
      "Guarda as suas escolhas de consentimento de cookies (aceitar, rejeitar ou categorias).",
      "Armazenamento local (localStorage)",
      "Até apagar os dados do browser ou alterar o consentimento",
      "Necessários",
    ],
    [
      "bellux-locale",
      company.legalName,
      "Memoriza o idioma selecionado (PT, ES ou EN).",
      "Armazenamento local (localStorage)",
      "Até apagar os dados do browser",
      "Preferências",
    ],
    [
      "_ga",
      "Google LLC (Google Analytics 4)",
      "Distingue utilizadores de forma agregada para estatísticas de audiência.",
      "Cookie de terceiros / HTTP",
      "Até 2 anos",
      "Analíticos",
    ],
    [
      "_ga_CDPPECXSK8",
      "Google LLC (Google Analytics 4)",
      "Mantém o estado da sessão e calcula métricas de visita no GA4.",
      "Cookie de terceiros / HTTP",
      "Até 2 anos",
      "Analíticos",
    ],
    [
      "_gid",
      "Google LLC (Google Analytics 4)",
      "Distingue utilizadores durante 24 horas para estatísticas.",
      "Cookie de terceiros / HTTP",
      "24 horas",
      "Analíticos",
    ],
  ],
  note: "Os cookies de Google Analytics (_ga, _ga_CDPPECXSK8, _gid) só são ativados se aceitar a categoria «Analíticos» (ID G-CDPPECXSK8). Não utilizamos atualmente cookies de marketing próprios; se no futuro forem ativados, esta tabela será atualizada.",
};

const cookieTableEs: LegalTable = {
  headers: [
    "Nombre",
    "Proveedor",
    "Finalidad",
    "Tipo",
    "Duración",
    "Categoría",
  ],
  rows: [
    [
      "bellux-cookie-consent",
      company.legalName,
      "Guarda sus elecciones de consentimiento de cookies (aceptar, rechazar o categorías).",
      "Almacenamiento local (localStorage)",
      "Hasta borrar los datos del navegador o cambiar el consentimiento",
      "Necesarias",
    ],
    [
      "bellux-locale",
      company.legalName,
      "Recuerda el idioma seleccionado (PT, ES o EN).",
      "Almacenamiento local (localStorage)",
      "Hasta borrar los datos del navegador",
      "Preferencias",
    ],
    [
      "_ga",
      "Google LLC (Google Analytics 4)",
      "Distingue usuarios de forma agregada para estadísticas de audiencia.",
      "Cookie de terceros / HTTP",
      "Hasta 2 años",
      "Analíticas",
    ],
    [
      "_ga_CDPPECXSK8",
      "Google LLC (Google Analytics 4)",
      "Mantiene el estado de la sesión y calcula métricas de visita en GA4.",
      "Cookie de terceros / HTTP",
      "Hasta 2 años",
      "Analíticas",
    ],
    [
      "_gid",
      "Google LLC (Google Analytics 4)",
      "Distingue usuarios durante 24 horas para estadísticas.",
      "Cookie de terceros / HTTP",
      "24 horas",
      "Analíticas",
    ],
  ],
  note: "Las cookies de Google Analytics (_ga, _ga_CDPPECXSK8, _gid) solo se activan si acepta la categoría «Analíticas» (ID G-CDPPECXSK8). No usamos actualmente cookies de marketing propias; si en el futuro se activan, esta tabla se actualizará.",
};

const cookieTableEn: LegalTable = {
  headers: [
    "Name",
    "Provider",
    "Purpose",
    "Type",
    "Duration",
    "Category",
  ],
  rows: [
    [
      "bellux-cookie-consent",
      company.legalName,
      "Stores your cookie consent choices (accept, reject or categories).",
      "Local storage (localStorage)",
      "Until browser data is cleared or consent is changed",
      "Necessary",
    ],
    [
      "bellux-locale",
      company.legalName,
      "Remembers the selected language (PT, ES or EN).",
      "Local storage (localStorage)",
      "Until browser data is cleared",
      "Preferences",
    ],
    [
      "_ga",
      "Google LLC (Google Analytics 4)",
      "Distinguishes users in aggregate for audience statistics.",
      "Third-party / HTTP cookie",
      "Up to 2 years",
      "Analytics",
    ],
    [
      "_ga_CDPPECXSK8",
      "Google LLC (Google Analytics 4)",
      "Keeps session state and calculates visit metrics in GA4.",
      "Third-party / HTTP cookie",
      "Up to 2 years",
      "Analytics",
    ],
    [
      "_gid",
      "Google LLC (Google Analytics 4)",
      "Distinguishes users for 24 hours for statistics.",
      "Third-party / HTTP cookie",
      "24 hours",
      "Analytics",
    ],
  ],
  note: "Google Analytics cookies (_ga, _ga_CDPPECXSK8, _gid) are only enabled if you accept the “Analytics” category (ID G-CDPPECXSK8). We do not currently use our own marketing cookies; if they are enabled later, this table will be updated.",
};

const avisoPt: LegalDoc = {
  id: "aviso-legal",
  path: "/aviso-legal",
  title: "Aviso legal",
  description: `Informação legal de ${company.brand} — ${company.legalName}.`,
  updatedLabel: updated.pt,
  sections: [
    {
      title: "1. Dados identificativos",
      paragraphs: [
        `Em cumprimento do disposto na legislação portuguesa aplicável e no Regulamento (UE) 2016/679 (RGPD), informa-se que o titular deste website é:`,
        `${identity}.`,
        `Sede: ${address}.`,
        `Telefone: ${company.phone} (Portugal) · ${company.phoneEs} (Espanha).`,
        `Website: ${company.website}.`,
      ],
    },
    {
      title: "2. Objeto",
      paragraphs: [
        `O presente website tem por objeto apresentar os serviços de animação, entretenimento e produção de espetáculos da marca ${company.brand}, bem como facilitar o contacto com potenciais clientes e parceiros.`,
      ],
    },
    {
      title: "3. Condições de utilização",
      paragraphs: [
        `O acesso e utilização deste website implicam a aceitação das presentes condições. O utilizador compromete-se a fazer um uso adequado dos conteúdos e serviços, abstendo-se de práticas ilícitas, lesivas de direitos de terceiros ou que possam danificar, sobrecarregar ou impedir o normal funcionamento do site.`,
      ],
    },
    {
      title: "4. Propriedade intelectual e industrial",
      paragraphs: [
        `Todos os conteúdos deste website (textos, imagens, vídeos, logótipos, design, código e demais elementos) são propriedade de ${company.legalName} ou de terceiros que autorizaram a sua utilização, e encontram-se protegidos pela legislação aplicável em matéria de propriedade intelectual e industrial.`,
        `É proibida a reprodução, distribuição, comunicação pública ou transformação dos conteúdos sem autorização prévia e por escrito do titular dos direitos, salvo nos casos legalmente permitidos.`,
      ],
    },
    {
      title: "5. Responsabilidade",
      paragraphs: [
        `${company.legalName} esforça-se por manter a informação atualizada e o website operacional, sem garantir a ausência total de erros, interrupções ou conteúdos desatualizados.`,
        `Não se responsabiliza por danos decorrentes do uso do website, da impossibilidade de acesso, ou de conteúdos de sites de terceiros eventualmente ligados a partir deste domínio.`,
      ],
    },
    {
      title: "6. Links",
      paragraphs: [
        `Este website pode incluir ligações a sites de terceiros (por exemplo, redes sociais). ${company.legalName} não controla esses sites e não se responsabiliza pelos seus conteúdos, políticas ou práticas.`,
      ],
    },
    {
      title: "7. Legislação aplicável",
      paragraphs: [
        `O presente aviso legal rege-se pela lei portuguesa. Para a resolução de quaisquer litígios, as partes submetem-se aos tribunais da comarca de Faro, sem prejuízo de normas imperativas em contrário.`,
      ],
    },
  ],
};

const privacidadePt: LegalDoc = {
  id: "privacidade",
  path: "/privacidade",
  title: "Política de privacidade",
  description: `Como ${company.brand} trata os seus dados pessoais.`,
  updatedLabel: updated.pt,
  sections: [
    {
      title: "1. Responsável pelo tratamento",
      paragraphs: [
        `O responsável pelo tratamento dos dados pessoais é ${identity}, com sede em ${address}.`,
        `Para questões relacionadas com privacidade, pode contactar-nos através do formulário de contacto do website ou pelo telefone ${company.phone}.`,
      ],
    },
    {
      title: "2. Dados que recolhemos",
      paragraphs: [
        `Podemos tratar os seguintes dados, consoante a interação com o website:`,
      ],
      list: [
        "Dados de identificação e contacto (nome, e-mail, telefone) enviados através do formulário de contacto ou WhatsApp.",
        "Informação sobre o evento ou pedido de orçamento que voluntariamente nos fornecer.",
        "Dados técnicos de navegação (endereço IP, tipo de dispositivo/navegador, páginas visitadas) através de cookies ou tecnologias semelhantes, nos termos da Política de Cookies.",
      ],
    },
    {
      title: "3. Finalidades e bases legais",
      paragraphs: [
        `Tratamos os dados para:`,
      ],
      list: [
        "Responder a pedidos de informação e orçamentos (execução de medidas pré-contratuais / interesse legítimo).",
        "Gerir a relação comercial quando exista contrato ou prestação de serviços (execução de contrato).",
        "Cumprir obrigações legais aplicáveis.",
        "Melhorar o website e analisar o seu uso, quando aplicável e com o consentimento necessário para cookies não essenciais.",
      ],
    },
    {
      title: "4. Conservação",
      paragraphs: [
        `Os dados são conservados apenas durante o tempo necessário às finalidades para que foram recolhidos, e pelo prazo adicional exigido por obrigações legais ou para a defesa de direitos em processos judiciais ou administrativos.`,
      ],
    },
    {
      title: "5. Destinatários",
      paragraphs: [
        `Os dados não são vendidos a terceiros. Podem ser acedidos por prestadores que nos apoiam na operação do website e comunicações (alojamento, ferramentas técnicas), sempre sob obrigação de confidencialidade e apenas na medida necessária.`,
        `Em caso de obrigação legal, os dados poderão ser comunicados às autoridades competentes.`,
      ],
    },
    {
      title: "6. Direitos dos titulares",
      paragraphs: [
        `Nos termos do RGPD, pode solicitar o acesso, retificação, apagamento, limitação, oposição e portabilidade dos seus dados, bem como retirar o consentimento quando o tratamento se baseie nele.`,
        `Para exercer os seus direitos, contacte-nos pelos meios indicados no ponto 1. Tem ainda o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD) — www.cnpd.pt.`,
      ],
    },
    {
      title: "7. Segurança",
      paragraphs: [
        `Adotamos medidas técnicas e organizativas adequadas para proteger os dados pessoais contra acesso não autorizado, perda ou alteração. Nenhum sistema é absolutamente seguro; recomendamos prudência na transmissão de informação sensível por canais abertos.`,
      ],
    },
    {
      title: "8. Menores",
      paragraphs: [
        `Os serviços apresentados destinam-se a profissionais e adultos. Não recolhemos deliberadamente dados de menores de 16 anos sem autorização dos titulares das responsabilidades parentais.`,
      ],
    },
  ],
};

const cookiesPt: LegalDoc = {
  id: "cookies",
  path: "/cookies",
  title: "Política de cookies",
  description: `Utilização de cookies no website de ${company.brand}.`,
  updatedLabel: updated.pt,
  sections: [
    {
      title: "1. O que são cookies",
      paragraphs: [
        `Cookies são pequenos ficheiros armazenados no seu dispositivo quando visita um website. Servem para o site funcionar corretamente, recordar preferências ou obter informação estatística sobre a navegação. Nesta política incluímos também tecnologias semelhantes, como o armazenamento local (localStorage).`,
      ],
    },
    {
      title: "2. Quem utiliza cookies",
      paragraphs: [
        `Este website é operado por ${identity}. Além dos cookies/armazenamento próprios, utilizamos Google Analytics 4 (Google LLC) para estatísticas, apenas com o seu consentimento na categoria «Analíticos».`,
      ],
    },
    {
      title: "3. Tipos de cookies",
      paragraphs: [`Classificamos os cookies nas seguintes categorias:`],
      list: [
        "Necessários: indispensáveis ao funcionamento do site e à gestão do consentimento.",
        "Preferências: memorizam opções como o idioma.",
        "Analíticos: Google Analytics 4, para compreender o uso do site de forma agregada.",
        "Marketing: não estão ativos de momento; se forem introduzidos, serão listados nesta política e exigirão consentimento.",
      ],
    },
    {
      title: "4. Tabela de cookies",
      paragraphs: [
        `Segue o inventário dos cookies e tecnologias semelhantes utilizadas ou previstas neste website:`,
      ],
      table: cookieTablePt,
    },
    {
      title: "5. Base legal",
      paragraphs: [
        `Os cookies/armazenamento estritamente necessários podem ser utilizados com base no interesse legítimo de garantir o funcionamento do website e o registo do consentimento. Os cookies de preferências, analíticos (incluindo Google Analytics) e marketing só são utilizados com o seu consentimento prévio, que pode retirar a qualquer momento.`,
      ],
    },
    {
      title: "6. Transferências internacionais",
      paragraphs: [
        `Google Analytics pode implicar o tratamento de dados por Google LLC, com servidores potencialmente fora do Espaço Económico Europeu. Nesse caso, aplicam-se as salvaguardas previstas pela Google (incluindo cláusulas contratuais-tipo, quando aplicável). Pode consultar mais informação em policies.google.com/privacy.`,
      ],
    },
    {
      title: "7. Gestão e desativação",
      paragraphs: [
        `Pode gerir o seu consentimento a qualquer momento através do banner de cookies ou da opção «Gerir cookies» no rodapé do website (Aceitar, Rejeitar ou Ajustes por categoria).`,
        `Também pode configurar o seu navegador para bloquear ou eliminar cookies. A forma de o fazer depende do navegador utilizado (Chrome, Firefox, Safari, Edge, etc.). Tenha em conta que desativar cookies necessários pode afetar o funcionamento de algumas funcionalidades.`,
      ],
    },
    {
      title: "8. Atualizações",
      paragraphs: [
        `Esta política pode ser atualizada para refletir alterações legais ou técnicas (por exemplo, novos cookies de Google Analytics ou marketing). A data de atualização consta no topo desta página.`,
      ],
    },
    {
      title: "9. Contacto",
      paragraphs: [
        `Para questões sobre cookies ou privacidade: ${company.legalName}, ${address}, telefone ${company.phone}.`,
      ],
    },
  ],
};

const avisoEs: LegalDoc = {
  id: "aviso-legal",
  path: "/aviso-legal",
  title: "Aviso legal",
  description: `Información legal de ${company.brand} — ${company.legalName}.`,
  updatedLabel: updated.es,
  sections: [
    {
      title: "1. Datos identificativos",
      paragraphs: [
        `En cumplimiento de la normativa aplicable y del Reglamento (UE) 2016/679 (RGPD), se informa de que el titular de este sitio web es:`,
        `${identity}.`,
        `Domicilio: ${address}.`,
        `Teléfono: ${company.phone} (Portugal) · ${company.phoneEs} (España).`,
        `Sitio web: ${company.website}.`,
      ],
    },
    {
      title: "2. Objeto",
      paragraphs: [
        `Este sitio web tiene por objeto presentar los servicios de animación, entretenimiento y producción de espectáculos de la marca ${company.brand}, así como facilitar el contacto con clientes y partners potenciales.`,
      ],
    },
    {
      title: "3. Condiciones de uso",
      paragraphs: [
        `El acceso y uso de este sitio implican la aceptación de estas condiciones. El usuario se compromete a un uso adecuado de los contenidos y servicios, absteniéndose de prácticas ilícitas, lesivas de derechos de terceros o que puedan dañar, sobrecargar o impedir el normal funcionamiento del sitio.`,
      ],
    },
    {
      title: "4. Propiedad intelectual e industrial",
      paragraphs: [
        `Todos los contenidos de este sitio web (textos, imágenes, vídeos, logotipos, diseño, código y demás elementos) son propiedad de ${company.legalName} o de terceros que han autorizado su uso, y están protegidos por la legislación aplicable en materia de propiedad intelectual e industrial.`,
        `Queda prohibida la reproducción, distribución, comunicación pública o transformación de los contenidos sin autorización previa y por escrito del titular de los derechos, salvo en los casos legalmente permitidos.`,
      ],
    },
    {
      title: "5. Responsabilidad",
      paragraphs: [
        `${company.legalName} se esfuerza por mantener la información actualizada y el sitio operativo, sin garantizar la ausencia total de errores, interrupciones o contenidos desactualizados.`,
        `No se responsabiliza de los daños derivados del uso del sitio, de la imposibilidad de acceso, o de contenidos de sitios de terceros enlazados desde este dominio.`,
      ],
    },
    {
      title: "6. Enlaces",
      paragraphs: [
        `Este sitio puede incluir enlaces a sitios de terceros (por ejemplo, redes sociales). ${company.legalName} no controla esos sitios y no se responsabiliza de sus contenidos, políticas o prácticas.`,
      ],
    },
    {
      title: "7. Legislación aplicable",
      paragraphs: [
        `El presente aviso legal se rige por la ley portuguesa. Para la resolución de cualquier controversia, las partes se someten a los tribunales del distrito de Faro, sin perjuicio de normas imperativas en contrario.`,
      ],
    },
  ],
};

const privacidadeEs: LegalDoc = {
  id: "privacidade",
  path: "/privacidade",
  title: "Política de privacidad",
  description: `Cómo ${company.brand} trata sus datos personales.`,
  updatedLabel: updated.es,
  sections: [
    {
      title: "1. Responsable del tratamiento",
      paragraphs: [
        `El responsable del tratamiento de los datos personales es ${identity}, con domicilio en ${address}.`,
        `Para cuestiones de privacidad puede contactarnos a través del formulario de contacto del sitio web o por el teléfono ${company.phone}.`,
      ],
    },
    {
      title: "2. Datos que recogemos",
      paragraphs: [
        `Podemos tratar los siguientes datos, según su interacción con el sitio:`,
      ],
      list: [
        "Datos de identificación y contacto (nombre, correo, teléfono) enviados mediante el formulario de contacto o WhatsApp.",
        "Información sobre el evento o solicitud de presupuesto que nos facilite voluntariamente.",
        "Datos técnicos de navegación (dirección IP, tipo de dispositivo/navegador, páginas visitadas) mediante cookies o tecnologías similares, según la Política de Cookies.",
      ],
    },
    {
      title: "3. Finalidades y bases jurídicas",
      paragraphs: [`Tratamos los datos para:`],
      list: [
        "Responder a solicitudes de información y presupuestos (medidas precontractuales / interés legítimo).",
        "Gestionar la relación comercial cuando exista contrato o prestación de servicios (ejecución de contrato).",
        "Cumplir obligaciones legales aplicables.",
        "Mejorar el sitio y analizar su uso, cuando proceda y con el consentimiento necesario para cookies no esenciales.",
      ],
    },
    {
      title: "4. Conservación",
      paragraphs: [
        `Los datos se conservan solo durante el tiempo necesario para las finalidades para las que fueron recogidos, y el plazo adicional exigido por obligaciones legales o para la defensa de derechos en procedimientos judiciales o administrativos.`,
      ],
    },
    {
      title: "5. Destinatarios",
      paragraphs: [
        `Los datos no se venden a terceros. Pueden acceder a ellos proveedores que nos ayudan a operar el sitio y las comunicaciones (alojamiento, herramientas técnicas), siempre bajo obligación de confidencialidad y solo en la medida necesaria.`,
        `En caso de obligación legal, los datos podrán comunicarse a las autoridades competentes.`,
      ],
    },
    {
      title: "6. Derechos de los interesados",
      paragraphs: [
        `Conforme al RGPD, puede solicitar el acceso, rectificación, supresión, limitación, oposición y portabilidad de sus datos, así como retirar el consentimiento cuando el tratamiento se base en él.`,
        `Para ejercer sus derechos, contáctenos por los medios del punto 1. También tiene derecho a presentar reclamación ante la Comissão Nacional de Proteção de Dados (CNPD) — www.cnpd.pt.`,
      ],
    },
    {
      title: "7. Seguridad",
      paragraphs: [
        `Adoptamos medidas técnicas y organizativas adecuadas para proteger los datos personales frente a accesos no autorizados, pérdida o alteración. Ningún sistema es absolutamente seguro; recomendamos prudencia al transmitir información sensible por canales abiertos.`,
      ],
    },
    {
      title: "8. Menores",
      paragraphs: [
        `Los servicios presentados se dirigen a profesionales y adultos. No recopilamos deliberadamente datos de menores de 16 años sin autorización de los titulares de la patria potestad o tutela.`,
      ],
    },
  ],
};

const cookiesEs: LegalDoc = {
  id: "cookies",
  path: "/cookies",
  title: "Política de cookies",
  description: `Uso de cookies en el sitio web de ${company.brand}.`,
  updatedLabel: updated.es,
  sections: [
    {
      title: "1. Qué son las cookies",
      paragraphs: [
        `Las cookies son pequeños archivos que se almacenan en su dispositivo al visitar un sitio web. Sirven para que el sitio funcione correctamente, recordar preferencias u obtener información estadística sobre la navegación. En esta política también incluimos tecnologías similares, como el almacenamiento local (localStorage).`,
      ],
    },
    {
      title: "2. Quién utiliza cookies",
      paragraphs: [
        `Este sitio web es operado por ${identity}. Además de las cookies/almacenamiento propios, utilizamos Google Analytics 4 (Google LLC) para estadísticas, solo con su consentimiento en la categoría «Analíticas».`,
      ],
    },
    {
      title: "3. Tipos de cookies",
      paragraphs: [`Clasificamos las cookies en las siguientes categorías:`],
      list: [
        "Necesarias: imprescindibles para el funcionamiento del sitio y la gestión del consentimiento.",
        "Preferencias: recuerdan opciones como el idioma.",
        "Analíticas: Google Analytics 4, para comprender el uso del sitio de forma agregada.",
        "Marketing: no están activas de momento; si se introducen, se listarán en esta política y exigirán consentimiento.",
      ],
    },
    {
      title: "4. Tabla de cookies",
      paragraphs: [
        `A continuación, el inventario de cookies y tecnologías similares utilizadas o previstas en este sitio:`,
      ],
      table: cookieTableEs,
    },
    {
      title: "5. Base jurídica",
      paragraphs: [
        `Las cookies/almacenamiento estrictamente necesarios pueden utilizarse sobre la base del interés legítimo de garantizar el funcionamiento del sitio y el registro del consentimiento. Las cookies de preferencias, analíticas (incluido Google Analytics) y marketing solo se utilizan con su consentimiento previo, que puede retirar en cualquier momento.`,
      ],
    },
    {
      title: "6. Transferencias internacionales",
      paragraphs: [
        `Google Analytics puede implicar el tratamiento de datos por Google LLC, con servidores potencialmente fuera del Espacio Económico Europeo. En ese caso se aplican las salvaguardas previstas por Google (incluidas cláusulas contractuales tipo, cuando proceda). Más información en policies.google.com/privacy.`,
      ],
    },
    {
      title: "7. Gestión y desactivación",
      paragraphs: [
        `Puede gestionar su consentimiento en cualquier momento mediante el banner de cookies o la opción «Gestionar cookies» en el pie del sitio (Aceptar, Rechazar o Ajustes por categoría).`,
        `También puede configurar su navegador para bloquear o eliminar cookies. El procedimiento depende del navegador (Chrome, Firefox, Safari, Edge, etc.). Desactivar cookies necesarias puede afectar al funcionamiento de algunas funciones.`,
      ],
    },
    {
      title: "8. Actualizaciones",
      paragraphs: [
        `Esta política puede actualizarse para reflejar cambios legales o técnicos (por ejemplo, nuevas cookies de Google Analytics o marketing). La fecha de actualización figura en la parte superior de esta página.`,
      ],
    },
    {
      title: "9. Contacto",
      paragraphs: [
        `Para cuestiones sobre cookies o privacidad: ${company.legalName}, ${address}, teléfono ${company.phone}.`,
      ],
    },
  ],
};

const avisoEn: LegalDoc = {
  id: "aviso-legal",
  path: "/aviso-legal",
  title: "Legal notice",
  description: `Legal information for ${company.brand} — ${company.legalName}.`,
  updatedLabel: updated.en,
  sections: [
    {
      title: "1. Identifying details",
      paragraphs: [
        `In accordance with applicable law and Regulation (EU) 2016/679 (GDPR), the owner of this website is:`,
        `${identity}.`,
        `Registered address: ${address}.`,
        `Phone: ${company.phone} (Portugal) · ${company.phoneEs} (Spain).`,
        `Website: ${company.website}.`,
      ],
    },
    {
      title: "2. Purpose",
      paragraphs: [
        `This website presents the entertainment, animation and live-show production services of the ${company.brand} brand, and makes it easier to contact prospective clients and partners.`,
      ],
    },
    {
      title: "3. Terms of use",
      paragraphs: [
        `Access to and use of this website imply acceptance of these terms. Users agree to use the content and services appropriately and not to engage in unlawful activity, infringe third-party rights, or disrupt, overload or impair the normal operation of the site.`,
      ],
    },
    {
      title: "4. Intellectual and industrial property",
      paragraphs: [
        `All content on this website (text, images, video, logos, design, code and other elements) is owned by ${company.legalName} or by third parties who have authorised its use, and is protected by applicable intellectual and industrial property law.`,
        `Reproduction, distribution, public communication or transformation of the content is forbidden without the rights holder’s prior written consent, except where legally permitted.`,
      ],
    },
    {
      title: "5. Liability",
      paragraphs: [
        `${company.legalName} endeavours to keep information up to date and the website available, without guaranteeing the complete absence of errors, interruptions or outdated content.`,
        `It is not liable for damage arising from use of the website, inability to access it, or content on third-party sites linked from this domain.`,
      ],
    },
    {
      title: "6. Links",
      paragraphs: [
        `This website may include links to third-party sites (for example social networks). ${company.legalName} does not control those sites and is not responsible for their content, policies or practices.`,
      ],
    },
    {
      title: "7. Governing law",
      paragraphs: [
        `This legal notice is governed by Portuguese law. Any dispute shall be submitted to the courts of the district of Faro, without prejudice to mandatory rules to the contrary.`,
      ],
    },
  ],
};

const privacidadeEn: LegalDoc = {
  id: "privacidade",
  path: "/privacidade",
  title: "Privacy policy",
  description: `How ${company.brand} processes your personal data.`,
  updatedLabel: updated.en,
  sections: [
    {
      title: "1. Data controller",
      paragraphs: [
        `The controller of personal data is ${identity}, with registered address at ${address}.`,
        `For privacy questions, contact us via the website contact form or by phone at ${company.phone}.`,
      ],
    },
    {
      title: "2. Data we collect",
      paragraphs: [
        `Depending on how you interact with the site, we may process:`,
      ],
      list: [
        "Identity and contact details (name, email, phone) submitted via the contact form or WhatsApp.",
        "Information about your event or quote request that you voluntarily provide.",
        "Technical browsing data (IP address, device/browser type, pages visited) via cookies or similar technologies, as described in the Cookies Policy.",
      ],
    },
    {
      title: "3. Purposes and legal bases",
      paragraphs: [`We process data in order to:`],
      list: [
        "Respond to information and quote requests (pre-contractual steps / legitimate interest).",
        "Manage the commercial relationship where a contract or service is in place (performance of a contract).",
        "Comply with applicable legal obligations.",
        "Improve the website and analyse its use, where applicable and with consent required for non-essential cookies.",
      ],
    },
    {
      title: "4. Retention",
      paragraphs: [
        `Data are kept only for as long as needed for the purposes for which they were collected, plus any additional period required by law or to defend rights in legal or administrative proceedings.`,
      ],
    },
    {
      title: "5. Recipients",
      paragraphs: [
        `We do not sell data to third parties. Providers who help us run the website and communications (hosting, technical tools) may access data under confidentiality obligations and only as needed.`,
        `Where legally required, data may be disclosed to competent authorities.`,
      ],
    },
    {
      title: "6. Your rights",
      paragraphs: [
        `Under the GDPR you may request access, rectification, erasure, restriction, objection and portability of your data, and withdraw consent where processing is based on it.`,
        `To exercise your rights, contact us using the details in section 1. You may also lodge a complaint with the Portuguese Data Protection Authority (CNPD) — www.cnpd.pt.`,
      ],
    },
    {
      title: "7. Security",
      paragraphs: [
        `We apply appropriate technical and organisational measures to protect personal data against unauthorised access, loss or alteration. No system is completely secure; please take care when sending sensitive information over open channels.`,
      ],
    },
    {
      title: "8. Minors",
      paragraphs: [
        `The services presented are aimed at professionals and adults. We do not knowingly collect data from anyone under 16 without authorisation from the holders of parental responsibility.`,
      ],
    },
  ],
};

const cookiesEn: LegalDoc = {
  id: "cookies",
  path: "/cookies",
  title: "Cookies policy",
  description: `How cookies are used on the ${company.brand} website.`,
  updatedLabel: updated.en,
  sections: [
    {
      title: "1. What cookies are",
      paragraphs: [
        `Cookies are small files stored on your device when you visit a website. They help the site work properly, remember preferences, or gather statistical information about browsing. This policy also covers similar technologies such as local storage (localStorage).`,
      ],
    },
    {
      title: "2. Who uses cookies",
      paragraphs: [
        `This website is operated by ${identity}. In addition to our own cookies/storage, we use Google Analytics 4 (Google LLC) for statistics, only with your consent in the “Analytics” category.`,
      ],
    },
    {
      title: "3. Types of cookies",
      paragraphs: [`We classify cookies into the following categories:`],
      list: [
        "Necessary: essential for the site to function and for consent management.",
        "Preferences: remember choices such as language.",
        "Analytics: Google Analytics 4, to understand site use in aggregate.",
        "Marketing: not active at present; if introduced, they will be listed in this policy and will require consent.",
      ],
    },
    {
      title: "4. Cookie table",
      paragraphs: [
        `Below is the inventory of cookies and similar technologies used or planned on this website:`,
      ],
      table: cookieTableEn,
    },
    {
      title: "5. Legal basis",
      paragraphs: [
        `Strictly necessary cookies/storage may be used on the basis of legitimate interest in keeping the website working and recording consent. Preference, analytics (including Google Analytics) and marketing cookies are only used with your prior consent, which you may withdraw at any time.`,
      ],
    },
    {
      title: "6. International transfers",
      paragraphs: [
        `Google Analytics may involve processing by Google LLC, with servers potentially outside the European Economic Area. In that case Google’s safeguards apply (including standard contractual clauses where applicable). See policies.google.com/privacy for more information.`,
      ],
    },
    {
      title: "7. Managing and disabling cookies",
      paragraphs: [
        `You can manage your consent at any time via the cookie banner or the “Manage cookies” option in the website footer (Accept, Reject or category Settings).`,
        `You can also configure your browser to block or delete cookies. Steps vary by browser (Chrome, Firefox, Safari, Edge, etc.). Disabling necessary cookies may affect some features.`,
      ],
    },
    {
      title: "8. Updates",
      paragraphs: [
        `This policy may be updated to reflect legal or technical changes (for example new Google Analytics or marketing cookies). The update date appears at the top of this page.`,
      ],
    },
    {
      title: "9. Contact",
      paragraphs: [
        `For questions about cookies or privacy: ${company.legalName}, ${address}, phone ${company.phone}.`,
      ],
    },
  ],
};

const docs: Record<Locale, Record<LegalDocId, LegalDoc>> = {
  pt: {
    "aviso-legal": avisoPt,
    privacidade: privacidadePt,
    cookies: cookiesPt,
  },
  es: {
    "aviso-legal": avisoEs,
    privacidade: privacidadeEs,
    cookies: cookiesEs,
  },
  en: {
    "aviso-legal": avisoEn,
    privacidade: privacidadeEn,
    cookies: cookiesEn,
  },
};

export const legalPaths = [
  "/aviso-legal",
  "/privacidade",
  "/cookies",
] as const;

export function getLegalDoc(locale: Locale, id: LegalDocId): LegalDoc {
  return docs[locale][id];
}
