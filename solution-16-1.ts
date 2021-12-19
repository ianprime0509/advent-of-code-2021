type Packet =
  | { version: number; type: "literal"; value: number }
  | { version: number; type: number; subPackets: Packet[] };

function decodeHex(hex: string): string {
  let binary = "";
  for (const c of hex) {
    binary += parseInt(c, 16).toString(2).padStart(4, "0");
  }
  return binary;
}

function readPacket(
  binary: string,
  index = 0
): { packet: Packet; nextIndex: number } {
  const version = parseInt(binary.substring(index, index + 3), 2);
  index += 3;
  const typeId = parseInt(binary.substring(index, index + 3), 2);
  index += 3;
  if (typeId === 4) {
    let valueBits = "";
    for (; ; index += 5) {
      valueBits += binary.substring(index + 1, index + 5);
      if (binary[index] === "0") {
        return {
          packet: { version, type: "literal", value: parseInt(valueBits, 2) },
          nextIndex: index + 5,
        };
      }
    }
  }

  const subPackets: Packet[] = [];
  if (binary[index] === "0") {
    index++;
    const length = parseInt(binary.substring(index, index + 15), 2);
    index += 15;
    const endIndex = index + length;
    while (index < endIndex) {
      const { packet: subPacket, nextIndex } = readPacket(binary, index);
      subPackets.push(subPacket);
      index = nextIndex;
    }
  } else {
    index++;
    const nPackets = parseInt(binary.substring(index, index + 11), 2);
    index += 11;
    for (let i = 0; i < nPackets; i++) {
      const { packet: subPacket, nextIndex } = readPacket(binary, index);
      subPackets.push(subPacket);
      index = nextIndex;
    }
  }

  return {
    packet: { version, type: typeId, subPackets },
    nextIndex: index,
  };
}

function sumVersions(packet: Packet): number {
  if (packet.type === "literal") {
    return packet.version;
  } else {
    return (
      packet.version +
      packet.subPackets.map(sumVersions).reduce((s1, s2) => s1 + s2)
    );
  }
}

const transmission = await Deno.readTextFile(Deno.args[0] ?? "input-16.txt");
const { packet } = readPacket(decodeHex(transmission));
console.log(sumVersions(packet));
