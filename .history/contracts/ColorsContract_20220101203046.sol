// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ColorsContract is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using Strings for uint32;

    struct Color {
        string title;
        string metadata;
        bool isValue;
    }

    uint32 public constant MaxColors = 16777215;
    bool public Debug = true;
    uint32 public LastColorHex = 0;

    address public ROKSWallet = address(0);
    address public ROKSContract = address(0);

    uint256 public RocksCommision = 0;
    uint256 public MargeCommision = 0;

    mapping(uint256 => Color) private _colorsInfo;

    event StateChanged(string stateData);

    constructor() ERC721("The Colors (thecolors.art)", "COLORS") {
        emit StateChanged("Init");
    }

    function setROKS(address contractAddress, address rOKSWallet)
        public
        onlyOwner
    {
        ROKSContract = contractAddress;
        ROKSWallet = rOKSWallet;
    }

    function setROKSCommision(uint256 rocksCommision) public onlyOwner {
        RocksCommision = rocksCommision;
    }

    function setMargeCommision(uint256 margeCommision) public onlyOwner {
        MargeCommision = margeCommision;
    }

    /*
     * админ минт
     */
    function mintColors(uint32[] memory colorCodes, string[] memory titles)
        public
        onlyOwner
    {
        require(
            totalSupply() + colorCodes.length <= MaxColors,
            "Max supply of Colors"
        );

        address tokenOwner = _msgSender();

        for (uint32 i = 0; i < colorCodes.length; i++) {
            _safeMint(tokenOwner, colorCodes[i]);
            _colorsInfo[colorCodes[i]] = Color(
                titles[i],
                colorCodes[i].toString(),
                true
            );
        }
    }

    /*
     * Мешание цветов (платный)
     * iterationCount - количество итераций которые нужно сделать когда цвет не уникальный
     */
    function margeColors(
        uint32 colorCode0,
        uint32 colorCode1,
        uint32 iterationCount
    ) public payable returns (uint32) {
        // Проверяем нашу комисию
        require(msg.value == MargeCommision);

        require(totalSupply() + 1 <= MaxColors, "Max supply of Colors");
        require(_exists(colorCode0));
        require(_exists(colorCode1));

        address owner0 = ownerOf(colorCode0);
        address owner1 = ownerOf(colorCode1);

        assert(owner0 == owner1);
        assert(owner1 == _msgSender());

        uint32 mageResult = predictColorAfterMarge(
            colorCode0,
            colorCode1,
            iterationCount
        );

        // Не удалось сгенерировать уникальный цвет
        // нужно прервать выполнение контракта
        assert(mageResult != 0);

        address tokenOwner = _msgSender();
        _safeMint(tokenOwner, mageResult);
        _colorsInfo[mageResult] = Color(
            uintToHexString(mageResult),
            mageResult.toString(),
            true
        );

        LastColorHex = mageResult;
        return mageResult;
    }

    // Предсказать какой цвет будет после слияния цветов
    // Этот контракт может вызывать любой желающий
    function predictColorAfterMarge(
        uint32 colorCode0,
        uint32 colorCode1,
        uint32 iterationCount
    ) internal view returns (uint32) {
        uint64 mageResult = colorCode0 + colorCode1;

        if (mageResult > MaxColors) {
            mageResult = mageResult - MaxColors;
        }

        for (uint32 i = 0; i < iterationCount; i++) {
            if (_colorsInfo[mageResult].isValue) {
                // Значит такой цвет есть и нужно генерировать новый
                mageResult = mageResult + 1 + i;
                if (mageResult > MaxColors) {
                    mageResult = mageResult - MaxColors;
                }
            } else {
                return uint32(mageResult);
            }
        }

        return 0;
    }

    /*
     * Нейминг (платный)
     * colorCode - уникальный код цвета
     * title - название
     * metadata - дополнительная дата
     */
    function setInfo(
        uint32 colorCode,
        string memory title,
        string memory metadata
    ) public {
        require(bytes(title).length > 512, "Max length of title is 512");
        require(bytes(title).length < 3, "Min length of title is 3");
        require(_colorsInfo[colorCode].isValue, "Color dosen't exist");

        if (ROKSContract != address(0) && ROKSWallet != address(0)) {
            ERC20 roks = ERC20(ROKSContract);
            assert(roks.balanceOf(_msgSender()) > RocksCommision);
            roks.transferFrom(_msgSender(), ROKSWallet, RocksCommision);
        }

        _colorsInfo[colorCode].title = title;
        _colorsInfo[colorCode].metadata = metadata;
    }

    /*
     * Рандом минт (с проверкой роксов потом) 100 итераций рандома
     * iterationCount - количество итераций которые нужно сделать когда цвет не уникальный
     */
    function mintRandomColor(uint32 iterationCount) public returns (uint32) {
        require(totalSupply() + 1 <= MaxColors, "Max supply of Colors");

        uint256 mintIndex;
        address tokenOwner = _msgSender();
        mintIndex = totalSupply();
        uint32 colorCode = generateRandomHexColor(mintIndex);
        bool generationSeccsess = false;

        for (uint256 i = 0; i < iterationCount; i++) {
            if (_colorsInfo[colorCode].isValue) {
                // Значит такой цвет есть и нужно генерировать новый
                colorCode = generateRandomHexColor(mintIndex);
            } else {
                generationSeccsess = true;
                continue;
            }
        }

        Debug = generationSeccsess;
        // Не удалось сгенерировать уникальный цвет
        // нужно прервать выполнение контракта
        //assert(generationSeccsess);

        _safeMint(tokenOwner, colorCode);
        _colorsInfo[colorCode] = Color(
            uintToHexString(colorCode),
            colorCode.toString(),
            true
        );

        LastColorHex = colorCode;
        return colorCode;
    }

    function getColorInfo(uint32 colorCode) public view returns (Color memory) {
        return _colorsInfo[colorCode];
    }

    function generateRandomHexColor(uint256 tokenId)
        internal
        view
        returns (uint32)
    {
        uint32 hexColor = uint32(_rng() % 16777215);

        hexColor = uint32(
            uint256(hexColor + block.timestamp * tokenId) % 16777215
        );

        return hexColor;
    }

    function _rng() internal view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.timestamp + block.difficulty))
            ) +
            uint256(keccak256(abi.encodePacked(block.coinbase))) /
            block.number +
            block.gaslimit;
    }

    function uintToHexString(uint256 number)
        public
        pure
        returns (string memory)
    {
        bytes32 value = bytes32(number);
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(6);
        for (uint256 i = 0; i < 3; i++) {
            str[i * 2] = alphabet[uint256(uint8(value[i + 29] >> 4))];
            str[1 + i * 2] = alphabet[uint256(uint8(value[i + 29] & 0x0f))];
        }

        return string(str);
    }
    // constructor function
}

interface ERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address _who) external view returns (uint256);

    function transfer(address _to, uint256 _value) external returns (bool);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool);

    function approve(address _spender, uint256 _value) external returns (bool);

    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
}
