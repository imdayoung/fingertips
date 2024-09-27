package fingertips.backend.asset.mapper;

import fingertips.backend.asset.dto.AssetDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AssetMapper {

    List<AssetDTO> getAllAssets(int id);
    void connectCard(int id);
    void connectAccount(int id);
}
